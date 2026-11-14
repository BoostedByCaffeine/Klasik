export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Steaming Coffee in a Glossy Miata-Red Cup (#dc2626) with White Sleeve, Red Emblem & White Lid
 */
export const RED_COFFEE_CUP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" rx="12" fill="#07090e"/><rect x="4" y="4" width="56" height="56" rx="10" fill="#111622" stroke="#dc2626" stroke-width="2"/><rect x="22" y="8" width="4" height="6" fill="#f8fafc"/><rect x="24" y="6" width="4" height="4" fill="#cbd5e1"/><rect x="30" y="6" width="4" height="8" fill="#f8fafc"/><rect x="38" y="8" width="4" height="6" fill="#f8fafc"/><rect x="14" y="16" width="36" height="4" fill="#ffffff"/><rect x="12" y="20" width="40" height="4" fill="#e2e8f0"/><rect x="16" y="24" width="32" height="8" fill="#dc2626"/><rect x="18" y="24" width="4" height="8" fill="#f87171"/><rect x="16" y="32" width="32" height="14" fill="#f8fafc"/><rect x="16" y="32" width="32" height="2" fill="#cbd5e1"/><rect x="16" y="44" width="32" height="2" fill="#cbd5e1"/><rect x="28" y="35" width="8" height="8" fill="#dc2626"/><rect x="30" y="37" width="4" height="4" fill="#facc15"/><rect x="18" y="46" width="28" height="8" fill="#dc2626"/><rect x="20" y="46" width="4" height="8" fill="#f87171"/><rect x="20" y="54" width="24" height="4" fill="#991b1b"/></svg>`;

export const RED_COFFEE_CUP_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(RED_COFFEE_CUP_SVG)}`;

export function buildKlasikManifestObject() {
  const startUrl =
    typeof window !== 'undefined' && window.location?.href ? window.location.href : './';
  let scopeUrl = './';
  try {
    if (typeof window !== 'undefined' && window.location?.href) {
      scopeUrl = new URL('./', window.location.href).href;
    }
  } catch {
    scopeUrl = './';
  }

  return {
    name: 'Klasik — Garage Garden Cafe',
    short_name: 'Klasik Cafe',
    description:
      'A cozy Gameboy Advance pixel-art Garden Garage Cafe management game featuring a 1990 Mazda Miata MX-5, Lilo & Champy cats, and realistic coffee prep.',
    start_url: startUrl,
    scope: scopeUrl,
    display: 'standalone',
    orientation: 'landscape',
    background_color: '#0b0d12',
    theme_color: '#dc2626',
    icons: [
      {
        src: RED_COFFEE_CUP_DATA_URI,
        sizes: '192x192 512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: RED_COFFEE_CUP_DATA_URI,
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}

export const KLASIK_MANIFEST_OBJECT = buildKlasikManifestObject();

export const KLASIK_MANIFEST_JSON_STRING = JSON.stringify(
  {
    ...KLASIK_MANIFEST_OBJECT,
    start_url: './',
    scope: './',
  },
  null,
  2
);

export const KLASIK_SW_JS_SOURCE = `const CACHE_NAME = 'klasik-vite-pwa-v3';
const PRECACHE_URLS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of PRECACHE_URLS) {
        try {
          const res = await fetch(url, { cache: 'no-cache' });
          if (res && res.ok && res.status === 200) {
            await cache.put(url, res);
          }
        } catch {}
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, copy).catch(() => {}));
          }
          return res;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('./index.html') || caches.match('./')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networked = fetch(event.request)
        .then((res) => {
          if (res && res.ok && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, copy).catch(() => {}));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networked;
    })
  );
});
`;

/**
 * Subtle tactile mobile haptic feedback helper (`navigator.vibrate(15)`)
 */
export function triggerHaptic(durationMs = 15): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(durationMs);
    }
  } catch {
    // Ignore unsupported vibration environments
  }
}

/**
 * Reliable environment detector returning `true` when running as an installed
 * Standalone/Fullscreen/Minimal-UI PWA, iOS Home Screen Web App, or Android TWA `.apk`.
 */
export function isStandaloneApp(): boolean {
  try {
    if (typeof window !== 'undefined') {
      if (typeof window.matchMedia === 'function') {
        if (window.matchMedia('(display-mode: standalone)').matches) return true;
        if (window.matchMedia('(display-mode: fullscreen)').matches) return true;
        if (window.matchMedia('(display-mode: minimal-ui)').matches) return true;
      }
      if ((window.navigator as unknown as { standalone?: boolean })?.standalone === true) {
        return true;
      }
    }
    if (
      typeof document !== 'undefined' &&
      typeof document.referrer === 'string' &&
      document.referrer.startsWith('android-app://')
    ) {
      return true;
    }
  } catch {
    // Ignore restricted environment checks
  }
  return false;
}

/**
 * Attaches an inline Blob Web App Manifest (with absolute start_url & scope so Blob URLs never error)
 * and safely registers `./sw.js` only if it exists on the server, purging stale v1/v2 caches.
 */
export async function initKlasikPwa(): Promise<{
  swRegistered: boolean;
  manifestAttached: boolean;
}> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { swRegistered: false, manifestAttached: false };
  }

  let manifestAttached = false;
  try {
    const dynamicManifest = buildKlasikManifestObject();
    const manifestBlob = new Blob([JSON.stringify(dynamicManifest, null, 2)], {
      type: 'application/manifest+json',
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    let linkEl = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.rel = 'manifest';
      document.head.appendChild(linkEl);
    }
    linkEl.href = manifestUrl;
    manifestAttached = true;
  } catch {
    manifestAttached = false;
  }

  // Self-healing cache purge for legacy v1/v2 caches that may hold stale subpath entries
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (k) =>
              (k.startsWith('klasik-cafe-pwa-') || k.startsWith('klasik-vite-pwa-')) &&
              k !== 'klasik-vite-pwa-v3'
          )
          .map((k) => caches.delete(k))
      );
    }
  } catch {
    // Ignore cache cleanup errors
  }

  let swRegistered = false;
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    try {
      const headRes = await fetch('./sw.js', { method: 'HEAD', cache: 'no-store' });
      const contentType = headRes.headers.get('content-type') || '';
      if (headRes.ok && !contentType.includes('text/html')) {
        const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        void reg.update().catch(() => {});
        swRegistered = Boolean(reg);
      }
    } catch {
      swRegistered = false;
    }
  }

  return { swRegistered, manifestAttached };
}

export function downloadTextAsset(filename: string, content: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
