/* ============================================================
   WEDDING WEBSITE — SCRIPT.JS
   Handles: navigation, dynamic rendering, countdown,
            scroll animations, gallery lightbox, RSVP form
   ============================================================ */

'use strict';

// ── Date formatting (Greek locale) ───────────────────────────
function formatDate(isoString, options) {
    return new Intl.DateTimeFormat('el-GR', options).format(new Date(isoString));
}

function weddingDateShort() {
    return formatDate(WEDDING.date.iso, { day: 'numeric', month: 'long', year: 'numeric' });
}

function weddingDateLong() {
    return formatDate(WEDDING.date.iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function deadlineDate() {
    return formatDate(WEDDING.rsvpDeadline.iso, { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Translations (Greek only) ─────────────────────────────────
function t(path) {
    const keys = path.split('.');
    let obj = TRANSLATIONS.el;
    for (const k of keys) {
        if (obj == null) return path;
        obj = obj[k];
    }
    return obj ?? path;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = t(el.dataset.i18n);
        if (typeof val === 'string') el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.documentElement.lang = 'el';
    const guestSel = document.getElementById('rsvp-guests');
    if (guestSel) {
        const opts = t('rsvp.guestOptions');
        if (Array.isArray(opts)) {
            guestSel.innerHTML = opts.map((label, i) =>
                `<option value="${i + 1}">${esc(label)}</option>`
            ).join('');
        }
    }
}

let scrollObserver = null;

// ── Entry point ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    renderHero();
    renderCountdown();
    renderStory();
    renderEvents();
    renderGallery();
    renderCouplePhoto();
    renderWitnesses();
    renderPhotoUpload();
    renderTravel();
    renderContact();
    renderFooter();
    updateSEO();
    applyTranslations();
    initScrollReveal();
    initRSVP();
});

// ── NAVIGATION ────────────────────────────────────────────────
function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const overlay = document.getElementById('mobile-nav');
    if (!nav || !toggle || !overlay) return;

    // Scroll: add "scrolled" class after 60px
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu open / close
    const openMenu = () => {
        toggle.classList.add('open');
        overlay.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        toggle.classList.remove('open');
        overlay.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () =>
        toggle.classList.contains('open') ? closeMenu() : openMenu()
    );

    // Close on overlay link click
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    // Update monogram from config
    document.querySelectorAll('.nav-monogram').forEach(el => {
        el.textContent = `${WEDDING.couple.partner1.charAt(0)} & ${WEDDING.couple.partner2.charAt(0)}`;
    });
}

// ── HERO ──────────────────────────────────────────────────────
function renderHero() {
    const img = document.getElementById('hero-img');
    const names = document.getElementById('hero-names');
    const date = document.getElementById('hero-date');

    if (img) {
        img.src = WEDDING.hero.image;
        img.alt = WEDDING.hero.imageAlt;
    }

    if (names) {
        names.innerHTML = `${esc(WEDDING.couple.partner1)} <span class="ampersand">&amp;</span> ${esc(WEDDING.couple.partner2)}`;
    }

    if (date) date.textContent = weddingDateLong();
}

// ── COUNTDOWN ─────────────────────────────────────────────────
function renderCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-minutes');
    const secsEl = document.getElementById('cd-seconds');
    const grid = document.getElementById('countdown-grid');
    const marriedEl = document.getElementById('countdown-married');

    if (!daysEl) return;

    const weddingMs = new Date(WEDDING.date.iso).getTime();

    const tick = () => {
        const diff = weddingMs - Date.now();

        if (diff <= 0) {
            if (grid) grid.style.display = 'none';
            if (marriedEl) {
                marriedEl.style.display = 'block';
                marriedEl.textContent = `${WEDDING.couple.fullNames} — ${t('countdown.married')}`;
            }
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        daysEl.textContent = pad(d);
        hoursEl.textContent = pad(h);
        minsEl.textContent = pad(m);
        secsEl.textContent = pad(s);
    };

    tick();
    setInterval(tick, 1000);
}

// ── OUR STORY ─────────────────────────────────────────────────
function renderStory() {
    // Circular couple photo
    const photoEl = document.getElementById('heart-photo-img');
    if (photoEl && WEDDING.heartPhoto) {
        photoEl.src = WEDDING.heartPhoto.image;
        photoEl.alt = WEDDING.heartPhoto.alt;
    }

    // Alternating heart timeline
    const container = document.getElementById('timeline');
    if (!container) return;

    container.innerHTML = WEDDING.timeline.map((item, i) => {
        const title = item.titleEl;
        const date = item.key === 'wedding' ? weddingDateShort() : item.dateEl;
        // odd items: text left, node centre, empty right
        // even items: empty left, node centre, text right
        const isLeft = i % 2 === 0;
        const textBlock = `
          <div class="timeline-title">${esc(title)}</div>
          <div class="timeline-date">${esc(date)}</div>`;
        return `
    <div class="timeline-item reveal reveal-delay-${(i % 3) + 1}" role="listitem">
      ${isLeft
                ? `<div class="timeline-left">${textBlock}</div>`
                : `<div class="timeline-empty"></div>`}
      <div class="timeline-node" aria-hidden="true">
        <span class="timeline-heart">♥</span>
      </div>
      ${isLeft
                ? `<div class="timeline-empty"></div>`
                : `<div class="timeline-right">${textBlock}</div>`}
    </div>`;
    }).join('');
}

// ── EVENTS + SAVE THE DATE ────────────────────────────────────
function renderEvents() {
    // Fill the "when" line under the Save the Date heading
    const whenEl = document.getElementById('save-date-when');
    if (whenEl) {
        whenEl.textContent = weddingDateLong();
    }

    // Populate save-date circular photo from hero if not a specific one
    const sdPhoto = document.getElementById('save-date-photo');
    if (sdPhoto && WEDDING.saveDatePhoto) {
        sdPhoto.src = WEDDING.saveDatePhoto.image;
        sdPhoto.alt = WEDDING.saveDatePhoto.alt;
    }

    const container = document.getElementById('events-grid');
    if (!container) return;

    container.innerHTML = WEDDING.events.map((ev, i) => {
        const label = t('events.labels.' + ev.type) || esc(ev.label);
        return `
    <article class="event-card reveal reveal-delay-${i + 1}">
      <p class="event-label">${label}</p>
      <h3 class="event-venue">${esc(ev.venue)}</h3>
      <div class="event-meta">
        <div class="event-meta-row">
          <span class="event-meta-key">${esc(t('events.dateKey'))}</span>
          <span>${esc(formatDate(ev.dateIso ?? WEDDING.date.iso.slice(0, 10), { day: 'numeric', month: 'long', year: 'numeric' }))}</span>
        </div>
        <div class="event-meta-row">
          <span class="event-meta-key">${esc(t('events.timeKey'))}</span>
          <span>${esc(ev.startTime)}</span>
        </div>
        <div class="event-meta-row">
          <span class="event-meta-key">${esc(t('events.venueKey'))}</span>
          <span>${esc(ev.address)}</span>
        </div>
      </div>
      <div class="event-divider"></div>
      <div class="event-actions">
        <a
          href="${escAttr(ev.mapUrl)}"
          class="event-btn"
          target="_blank"
          rel="noopener noreferrer"
        >${esc(t('events.mapBtn'))}</a>
        <a
          href="${escAttr(buildCalendarUrl(ev))}"
          class="event-btn"
          target="_blank"
          rel="noopener noreferrer"
        >${esc(t('events.calBtn'))}</a>
      </div>
    </article>`;
    }).join('');
}

function buildCalendarUrl(ev) {
    const isoDate = ev.dateIso ?? WEDDING.date.iso.slice(0, 10);
    const startDate = isoDate.replace(/-/g, '');
    const startHHMM = ev.startTime.replace(':', '');
    const hasNextDay = ev.endTime.includes('+1');
    const endHHMM = ev.endTime.replace('+1', '').replace(':', '');
    const endDate = hasNextDay ? nextDay(isoDate).replace(/-/g, '') : startDate;

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `${WEDDING.couple.fullNames} — ${t('events.labels.' + ev.type) || ev.label}`,
        dates: `${startDate}T${startHHMM}00/${endDate}T${endHHMM}00`,
        details: ev.description,
        location: ev.address,
        ctz: WEDDING.date.timezone
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function nextDay(isoDate) {
    const d = new Date(isoDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
}

// ── GALLERY ───────────────────────────────────────────────────
let galleryImages = [];

// ── GALLERY SLIDER ────────────────────────────────────────────
let currentIndex = 0;

function renderGallery() {
    const img = WEDDING.gallery[0];
    if (!img) return;
    const el = document.getElementById('gallery-single-img');
    if (el) { el.src = img.src; el.alt = img.alt; }
}

// initLightbox kept as no-op so call in DOMContentLoaded doesn't error
function initLightbox() { }

// ── TRAVEL ────────────────────────────────────────────────────
function renderPhotoUpload() {
    if (!WEDDING.photoUpload?.enabled) { hide('photos'); return; }

    const noteEl = document.getElementById('photos-note');
    const uploadEl = document.getElementById('photos-upload-link');
    const viewEl = document.getElementById('photos-view-link');

    if (noteEl) noteEl.textContent = t('photos.note');

    if (uploadEl) {
        const url = WEDDING.photoUpload.driveUrl;
        uploadEl.href = url || '#';
        if (!url) uploadEl.style.opacity = '0.4';
    }

    if (viewEl) {
        const url = WEDDING.photoUpload.viewUrl;
        const isPlaceholder = !url || url === 'YOUR_DROPBOX_FOLDER_SHARE_URL';
        viewEl.href = isPlaceholder ? '#' : url;
        if (isPlaceholder) viewEl.style.opacity = '0.4';
    }
}

function renderCouplePhoto() {
    const img = document.getElementById('couple-photo-img');
    if (!img || !WEDDING.couplePhoto) return;
    img.src = WEDDING.couplePhoto.image;
    img.alt = WEDDING.couplePhoto.alt;
}

function renderWitnesses() {
    const container = document.getElementById('witnesses-grid');
    if (!container || !WEDDING.witnesses?.length) { hide('witnesses'); return; }

    container.innerHTML = WEDDING.witnesses.map(w => `
        <div class="witness-card reveal">
            <img class="witness-photo" src="${escAttr(w.image)}" alt="${escAttr(w.alt)}" loading="lazy" decoding="async" />
            <div class="witness-name">${esc(w.name)}</div>
            <div class="witness-role">${esc(w.role)}</div>
        </div>
    `).join('');
}

function renderTravel() {
    if (!WEDDING.travel.enabled) {
        hide('travel');
        return;
    }

    const container = document.getElementById('travel-grid');
    if (!container) return;

    const txItems = t('travel.items');
    container.innerHTML = WEDDING.travel.items.map((item, i) => {
        const tx = (Array.isArray(txItems) && txItems[i]) || {};
        return `
    <div class="travel-item reveal">
      <div class="travel-icon" aria-hidden="true">${item.icon}</div>
      <h3 class="travel-title">${esc(tx.title || item.title)}</h3>
      <p class="travel-text">${esc(tx.text || item.text)}</p>
    </div>`;
    }).join('');
}



// ── FAQ ───────────────────────────────────────────────────────
function renderFAQ() {
    if (!WEDDING.faq.enabled) {
        hide('faq');
        return;
    }

    const container = document.getElementById('faq-list');
    if (!container) return;

    const faqItems = t('faq.items');
    const items = Array.isArray(faqItems) ? faqItems : WEDDING.faq.items;
    container.innerHTML = items.map((item, i) => `
    <div class="faq-item">
      <button
        class="faq-question"
        aria-expanded="false"
        aria-controls="faq-a-${i}"
        id="faq-q-${i}"
        type="button"
      >
        ${esc(item.q)}
        <span class="faq-toggle" aria-hidden="true">+</span>
      </button>
      <div
        class="faq-answer"
        id="faq-a-${i}"
        role="region"
        aria-labelledby="faq-q-${i}"
      >
        <div class="faq-answer-inner">${esc(item.a)}</div>
      </div>
    </div>
  `).join('');

    // Accordion
    container.addEventListener('click', e => {
        const btn = e.target.closest('.faq-question');
        if (!btn) return;

        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all open items
        container.querySelectorAll('.faq-item.open').forEach(el => {
            el.classList.remove('open');
            el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked item
        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
}

// ── CONTACT ───────────────────────────────────────────────────
function renderContact() {
    if (!WEDDING.contact.enabled) {
        hide('contact');
        return;
    }

    const noteEl = document.getElementById('contact-note');
    const phonesEl = document.getElementById('contact-phones');

    if (noteEl) noteEl.textContent = t('contact.note');
    if (phonesEl) {
        const { bride, groom } = WEDDING.contact;
        phonesEl.innerHTML = [bride, groom].map(p =>
            `<div class="contact-person">
                <span class="contact-person-name">${esc(p.name)}</span>
                <a class="contact-link" href="tel:${escAttr(p.phone)}">${esc(p.phone)}</a>
             </div>`
        ).join('');
    }
}

// ── FOOTER & GLOBAL REFS ──────────────────────────────────────
function renderFooter() {
    const namesEl = document.getElementById('footer-names');
    const dateEl = document.getElementById('footer-date');
    const deadlineEl = document.getElementById('rsvp-deadline');

    if (namesEl) namesEl.textContent = WEDDING.couple.fullNames;
    if (dateEl) dateEl.textContent = weddingDateLong();
    if (deadlineEl) deadlineEl.textContent = deadlineDate();
}

// ── SEO / SOCIAL ──────────────────────────────────────────────
function updateSEO() {
    const seoTitle = `${WEDDING.couple.fullNames} — ${weddingDateShort()}`;
    const seoDesc = `${t('events.subtitle')} ${weddingDateLong()} · ${t('contact.tag')}`;

    document.title = seoTitle;
    setMeta('description', seoDesc);
    setOG('og:title', seoTitle);
    setOG('og:description', seoDesc);
    setOG('og:image', WEDDING.seo.ogImage);
}

function setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
}

function setOG(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
    el.content = content;
}

// ── SCROLL REVEAL (Intersection Observer) ─────────────────────
function initScrollReveal() {
    scrollObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    scrollObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el));
    }, 120);
}

// ── RSVP FORM ─────────────────────────────────────────────────
function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const successEl = document.getElementById('rsvp-success');
    const errorEl = document.getElementById('rsvp-error');
    const demoNoteEl = document.getElementById('rsvp-demo-note');
    const submitBtn = document.getElementById('rsvp-submit');
    const guestsField = document.getElementById('guests-field');

    if (!form) return;

    const configured = WEDDING.supabase.url !== 'YOUR_SUPABASE_URL';

    // Show demo notice when Supabase not yet configured
    if (!configured && demoNoteEl) {
        demoNoteEl.classList.remove('hidden');
        demoNoteEl.innerHTML = t('rsvp.demoNote');
    }

    // Show/hide guest count field based on attendance selection
    form.addEventListener('change', e => {
        if (e.target.name !== 'attendance') return;
        if (guestsField) guestsField.classList.toggle('hidden', e.target.value !== 'yes');
    });

    // Form submit
    form.addEventListener('submit', async e => {
        e.preventDefault();

        if (errorEl) errorEl.classList.add('hidden');

        submitBtn.disabled = true;
        submitBtn.textContent = t('rsvp.sendingBtn');

        const data = {
            name: sanitize(form.elements.name.value),
            email: sanitize(form.elements.email.value),
            attendance: form.elements.attendance.value,
            guests: parseInt(form.elements.guests?.value ?? '1', 10),
            dietary: sanitize(form.elements.dietary?.value) || null,
            message: sanitize(form.elements.message?.value) || null
        };

        // Validate
        if (!data.name || data.name.length < 2) {
            return showError(t('rsvp.errName'), errorEl, submitBtn);
        }
        if (!validEmail(data.email)) {
            return showError(t('rsvp.errEmail'), errorEl, submitBtn);
        }
        if (!data.attendance) {
            return showError(t('rsvp.errAttendance'), errorEl, submitBtn);
        }
        if (data.guests < 1 || data.guests > 10 || isNaN(data.guests)) {
            return showError(t('rsvp.errGuests'), errorEl, submitBtn);
        }

        try {
            if (configured) {
                await saveToSupabase(data);
            } else {
                // Demo mode: simulate 1.2 s network delay
                await new Promise(r => setTimeout(r, 1200));
            }

            // Success
            form.style.display = 'none';
            if (demoNoteEl) demoNoteEl.style.display = 'none';

            if (successEl) {
                const firstName = esc(data.name.split(' ')[0]);
                const attending = data.attendance === 'yes';
                const dateStr = weddingDateShort();
                const fill = s => s.replace('{name}', firstName).replace('{date}', esc(dateStr));
                successEl.classList.remove('hidden');
                successEl.innerHTML = attending
                    ? `<h3>${fill(t('rsvp.successYesH'))}</h3><p>${fill(t('rsvp.successYesP'))}</p>`
                    : `<h3>${fill(t('rsvp.successNoH'))}</h3><p>${fill(t('rsvp.successNoP'))}</p>`;
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        } catch (err) {
            console.error('RSVP error:', err);
            showError(t('rsvp.errGeneric'), errorEl, submitBtn);
        }
    });
}

async function saveToSupabase(data) {
    // window.supabase is injected by the CDN script
    if (!window.supabase) throw new Error('Supabase SDK not available');

    const client = window.supabase.createClient(
        WEDDING.supabase.url,
        WEDDING.supabase.anonKey
    );

    const { error } = await client.from('rsvps').insert([data]);
    if (error) throw error;
}

function showError(msg, errorEl, submitBtn) {
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = t('rsvp.submitBtn');
    }
}

// ── HELPERS ───────────────────────────────────────────────────

function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/** Trim and strip HTML tags to prevent XSS in data values */
function sanitize(v) {
    return (v || '').trim().replace(/<[^>]*>/g, '');
}

/** Escape for safe innerHTML output */
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/** Escape for HTML attribute values */
function escAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/** Pad a number to 2 digits */
function pad(n) {
    return String(n).padStart(2, '0');
}

/** Hide a section by id */
function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}
