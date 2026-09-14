/* ============================================================
   WEDDING ADMIN — admin.js
   Supabase Auth login, real-time RSVP dashboard,
   browser notifications
   ============================================================ */

'use strict';

// ── State ─────────────────────────────────────────────────────
let supabaseClient = null;
let allRsvps = [];
let currentFilter = 'all';
let searchQuery = '';
let realtimeChannel = null;
let notificationsEnabled = false;
let toastTimer = null;

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    registerServiceWorker();

    supabaseClient = supabase.createClient(
        WEDDING.supabase.url,
        WEDDING.supabase.anonKey
    );

    bindUI();

    // Check for an existing session first
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        await enterDashboard();
    } else {
        showView('login');
    }

    // React to auth state changes (login / logout)
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            await enterDashboard();
        } else if (event === 'SIGNED_OUT') {
            teardownRealtime();
            allRsvps = [];
            showView('login');
        }
    });
});

// ── Register Service Worker ───────────────────────────────────
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.warn('SW registration failed:', err);
        });
    }
}

// ── Bind UI events ────────────────────────────────────────────
function bindUI() {
    document.getElementById('login-form')
        .addEventListener('submit', handleLogin);

    document.getElementById('logout-btn')
        .addEventListener('click', handleLogout);

    document.getElementById('notif-btn')
        .addEventListener('click', handleNotifToggle);

    document.getElementById('search-input')
        .addEventListener('input', e => {
            searchQuery = e.target.value.trim();
            renderTable();
        });

    document.getElementById('export-btn')
        .addEventListener('click', exportCSV);

    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab')
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTable();
        });
    });
}

// ── Login ─────────────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();

    const btn = document.getElementById('login-btn');
    const errorEl = document.getElementById('login-error');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    errorEl.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = 'Σύνδεση…';

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        errorEl.textContent = 'Λανθασμένα στοιχεία σύνδεσης. Δοκιμάστε ξανά.';
        errorEl.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Σύνδεση';
    }
    // onAuthStateChange takes over on success
}

// ── Logout ────────────────────────────────────────────────────
async function handleLogout() {
    teardownRealtime();
    await supabaseClient.auth.signOut();
}

// ── Enter dashboard ───────────────────────────────────────────
async function enterDashboard() {
    showView('dashboard');
    await loadRsvps();
    subscribeRealtime();
    syncNotifButton();
    // Auto-enable notifications if already granted
    if (Notification.permission === 'granted') notificationsEnabled = true;
    syncNotifButton();
}

// ── Load all RSVPs ────────────────────────────────────────────
async function loadRsvps() {
    setTableLoading(true);

    const { data, error } = await supabaseClient
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

    setTableLoading(false);

    if (error) {
        console.error('Failed to load RSVPs:', error);
        showTableError('Σφάλμα κατά τη φόρτωση. Ανανεώστε τη σελίδα.');
        return;
    }

    allRsvps = data ?? [];
    updateStats();
    renderTable();
}

// ── Real-time subscription ────────────────────────────────────
function subscribeRealtime() {
    realtimeChannel = supabaseClient
        .channel('admin-rsvps-live')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'rsvps' },
            payload => onNewRsvp(payload.new)
        )
        .subscribe(status => {
            const badge = document.getElementById('live-badge');
            if (badge) badge.style.display = status === 'SUBSCRIBED' ? '' : 'none';
        });
}

function teardownRealtime() {
    if (realtimeChannel && supabaseClient) {
        supabaseClient.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }
}

// ── Handle new real-time RSVP ─────────────────────────────────
function onNewRsvp(rsvp) {
    // Avoid duplicates if we already have it
    if (allRsvps.some(r => r.id === rsvp.id)) return;

    allRsvps.unshift(rsvp);
    updateStats();
    renderTable();
    showToast(rsvp);
    triggerNotification(rsvp);
}

// ── Stats ─────────────────────────────────────────────────────
function updateStats() {
    const attending = allRsvps.filter(r => r.attendance === 'yes');
    const declined = allRsvps.filter(r => r.attendance === 'no');
    const guests = attending.reduce((s, r) => s + (r.guests || 0), 0);

    setText('stat-total', allRsvps.length);
    setText('stat-attending', attending.length);
    setText('stat-declined', declined.length);
    setText('stat-guests', guests);
}

// ── Table rendering ───────────────────────────────────────────
function renderTable() {
    const tbody = document.getElementById('rsvp-tbody');
    const noResult = document.getElementById('no-results');
    const countEl = document.getElementById('table-count');

    let rows = allRsvps.slice();

    if (currentFilter !== 'all') {
        rows = rows.filter(r => r.attendance === currentFilter);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        rows = rows.filter(r =>
            r.name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q)
        );
    }

    if (rows.length === 0) {
        tbody.innerHTML = '';
        noResult.classList.remove('hidden');
        if (countEl) countEl.textContent = '';
        return;
    }

    noResult.classList.add('hidden');

    tbody.innerHTML = rows.map((r, idx) => {
        const attending = r.attendance === 'yes';
        const dateStr = formatDateTime(r.created_at);
        return `
        <tr class="${attending ? 'row-yes' : 'row-no'}">
          <td>${esc(String(rows.length - idx))}</td>
          <td style="white-space:nowrap">${esc(dateStr)}</td>
          <td><strong>${esc(r.name)}</strong></td>
          <td><a href="mailto:${escAttr(r.email)}" style="color:var(--accent)">${esc(r.email)}</a></td>
          <td>
            <span class="badge ${attending ? 'badge-yes' : 'badge-no'}">
              ${attending ? '✓ Θα έρθει' : '✗ Δεν θα έρθει'}
            </span>
          </td>
          <td>${attending ? esc(String(r.guests)) : '—'}</td>
          <td>${esc(r.dietary || '—')}</td>
          <td class="msg-cell">${esc(r.message || '—')}</td>
        </tr>`;
    }).join('');

    if (countEl) {
        countEl.textContent = `Εμφανίζονται ${rows.length} από ${allRsvps.length} απαντήσεις`;
    }
}

// ── Notifications ─────────────────────────────────────────────
async function handleNotifToggle() {
    if (Notification.permission === 'denied') return; // blocked — can't do anything

    if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        notificationsEnabled = result === 'granted';
    } else {
        notificationsEnabled = !notificationsEnabled;
    }

    syncNotifButton();
}

function syncNotifButton() {
    const btn = document.getElementById('notif-btn');
    if (!btn) return;

    btn.className = 'btn-notif';

    if (Notification.permission === 'denied') {
        btn.textContent = '🔕 Ειδοποιήσεις αποκλεισμένες';
        btn.classList.add('btn-notif--blocked');
        btn.title = 'Επιτρέψτε ειδοποιήσεις στις ρυθμίσεις του browser σας.';
        return;
    }

    if (notificationsEnabled && Notification.permission === 'granted') {
        btn.textContent = '🔔 Ειδοποιήσεις ενεργές';
        btn.classList.add('btn-notif--on');
    } else {
        btn.textContent = '🔕 Ενεργοποίηση ειδοποιήσεων';
    }
}

function triggerNotification(rsvp) {
    if (!notificationsEnabled || Notification.permission !== 'granted') return;

    const attending = rsvp.attendance === 'yes';
    const body = attending
        ? `${rsvp.name} θα παρευρεθεί με ${rsvp.guests} άτομα!`
        : `${rsvp.name} δεν μπορεί να παρευρεθεί.`;

    const notif = new Notification('Νέο RSVP! 💌', {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: `rsvp-${rsvp.id}`,
        renotify: false
    });

    notif.onclick = () => { window.focus(); notif.close(); };
}

// ── In-app toast ──────────────────────────────────────────────
function showToast(rsvp) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const attending = rsvp.attendance === 'yes';
    toast.className = `toast ${attending ? 'toast--yes' : 'toast--no'}`;
    toast.textContent = attending
        ? `Νέο RSVP: ${rsvp.name} θα έρθει με ${rsvp.guests} άτομα!`
        : `Νέο RSVP: ${rsvp.name} δεν μπορεί να έρθει.`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 5000);
}

// ── CSV export ────────────────────────────────────────────────
function exportCSV() {
    const headers = ['ID', 'Ημερομηνία', 'Όνομα', 'Email', 'Παρουσία', 'Άτομα', 'Διατροφή', 'Μήνυμα'];

    const rows = allRsvps.map(r => [
        r.id,
        r.created_at,
        r.name,
        r.email,
        r.attendance === 'yes' ? 'Ναι' : 'Όχι',
        r.attendance === 'yes' ? r.guests : 0,
        r.dietary || '',
        r.message || ''
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ── View switching ────────────────────────────────────────────
function showView(name) {
    document.getElementById('login-view').classList.toggle('hidden', name !== 'login');
    document.getElementById('dashboard-view').classList.toggle('hidden', name !== 'dashboard');
}

// ── Table helpers ─────────────────────────────────────────────
function setTableLoading(on) {
    const tbody = document.getElementById('rsvp-tbody');
    if (!tbody) return;
    if (on) {
        tbody.innerHTML = `
          <tr id="loading-row">
            <td colspan="8" class="table-loading">
              <span class="loading-spinner" aria-hidden="true"></span>
              Φόρτωση δεδομένων…
            </td>
          </tr>`;
    }
}

function showTableError(msg) {
    const tbody = document.getElementById('rsvp-tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="8" class="table-loading" style="color:var(--no)">${esc(msg)}</td></tr>`;
    }
}

// ── Formatters & utils ────────────────────────────────────────
function formatDateTime(iso) {
    return new Intl.DateTimeFormat('el-GR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso));
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escAttr(str) {
    return String(str ?? '').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
