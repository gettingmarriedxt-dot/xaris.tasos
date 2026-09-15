/* ============================================================
   SERVICE WORKER — Wedding PWA
   Handles: offline caching, push notifications
   ============================================================ */

'use strict';

const CACHE_NAME = 'wedding-v2';

// No install-time precaching — files are cached lazily on first request (see fetch handler).
// Precaching would re-fetch every file a second time on each new visitor, doubling requests.
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

// ── Activate: remove stale caches ────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: cache-first for static, network-first for API ─────
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Always go to network for Supabase API calls
    if (url.hostname.includes('supabase.co')) return;

    // Cache-first for same-origin static assets
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => {
                    // Offline fallback for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
        );
        return;
    }

    // Fonts / CDN: stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then(cached => {
            const network = fetch(event.request).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
            return cached || network;
        })
    );
});

// ── Push: show notification when app is in background ────────
self.addEventListener('push', event => {
    const payload = event.data?.json() ?? {};
    const title = payload.title ?? 'Νέο RSVP!';
    const options = {
        body: payload.body ?? 'Μια νέα απάντηση ελήφθη.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: payload.tag ?? 'rsvp-new',
        data: { url: '/admin.html' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification click: focus or open admin page ──────────────
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetUrl = event.notification.data?.url ?? '/admin.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (const client of windowClients) {
                if (client.url.includes('admin.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(targetUrl);
        })
    );
});
