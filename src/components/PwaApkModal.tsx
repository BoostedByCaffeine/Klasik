import React, { useEffect, useState } from 'react';
import {
  KLASIK_MANIFEST_JSON_STRING,
  KLASIK_SW_JS_SOURCE,
  RED_COFFEE_CUP_DATA_URI,
  downloadTextAsset,
} from '../pwa/pwaManager';
import { STANDALONE_KLASIK_HTML } from '../game/standaloneHtml';

interface PwaApkModalProps {
  isInstallable: boolean;
  isInstalled: boolean;
  swRegistered: boolean;
  onTriggerInstallPrompt: () => Promise<boolean>;
  onClose: () => void;
}

export const PwaApkModal: React.FC<PwaApkModalProps> = ({
  isInstallable,
  isInstalled,
  swRegistered,
  onTriggerInstallPrompt,
  onClose,
}) => {
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await onTriggerInstallPrompt();
      setStatusNote(
        accepted
          ? '✓ Klasik Cafe installed to your device home screen!'
          : 'Install prompt dismissed — you can also install anytime via browser menu.'
      );
    } else if (isInstalled) {
      setStatusNote('✓ Klasik Cafe is already running as an installed standalone app!');
    } else {
      setStatusNote(
        '📲 On Chrome/Edge/Android: tap Browser Menu (⋮) → "Install app" or "Add to Home screen". On iOS Safari: tap Share → "Add to Home Screen".'
      );
    }
  };

  return (
    <div
      data-testid="pwa-apk-modal"
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: 'rgba(7, 9, 14, 0.88)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-apk-modal-title"
    >
      <div className="gba-frame w-full max-w-2xl p-3 sm:p-4 text-[#f8fafc] max-h-[94dvh] overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#334155]">
          <div className="flex items-center gap-2.5">
            <img
              src={RED_COFFEE_CUP_DATA_URI}
              alt="Red Coffee Cup App Icon"
              className="w-9 h-9 border-2 border-[#dc2626]"
            />
            <div>
              <h2
                id="pwa-apk-modal-title"
                className="text-xs sm:text-sm font-['Silkscreen'] font-bold text-[#facc15]"
              >
                📱 OFFLINE PWA &amp; ANDROID .APK STUDIO
              </h2>
              <p className="text-base font-['VT323'] text-[#cbd5e1]">
                100% Offline Airplane-Mode Cache, Home-Screen Install &amp; Signed Android .APK Export.
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-pwa-apk-btn"
            onClick={onClose}
            className="gba-btn px-2.5 py-1 text-[9px] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        {/* Live Offline & SW Telemetry Strip */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2.5 text-center">
            <div className="text-[8px] font-['Silkscreen'] text-[#94a3b8]">NETWORK STATUS</div>
            <div
              data-testid="pwa-network-status"
              className={`mt-1 text-[10px] font-['Silkscreen'] font-bold ${
                isOnline ? 'text-[#4ade80]' : 'text-[#fde047]'
              }`}
            >
              {isOnline ? '● ONLINE (SYNCED)' : '✈️ OFFLINE MODE'}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2.5 text-center">
            <div className="text-[8px] font-['Silkscreen'] text-[#94a3b8]">SERVICE WORKER</div>
            <div
              data-testid="pwa-sw-status"
              className="mt-1 text-[10px] font-['Silkscreen'] font-bold text-[#7dd3fc]"
            >
              {swRegistered ? '✓ SW CACHE READY' : '✓ INLINE CACHE READY'}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2.5 text-center">
            <div className="text-[8px] font-['Silkscreen'] text-[#94a3b8]">LOCAL SAVE V2</div>
            <div className="mt-1 text-[10px] font-['Silkscreen'] font-bold text-[#facc15]">
              ✓ AUTO-SAVED
            </div>
          </div>
        </div>

        {/* 1-Click In-App Install Banner */}
        <div className="mt-3 bg-[#0f172a] border-2 border-[#dc2626] p-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-['Silkscreen'] font-bold text-[#f8fafc]">
              📲 INSTALL KLASIK CAFE TO HOME SCREEN / DESKTOP
            </div>
            <p className="text-base font-['VT323'] text-[#cbd5e1]">
              Launches full-screen in Landscape mode (`display: standalone`) with the Red Coffee Cup icon.
            </p>
          </div>
          <button
            type="button"
            data-testid="modal-trigger-install-btn"
            onClick={handleInstallClick}
            className="gba-btn gba-btn-active px-3 py-2 text-[9px] cursor-pointer shrink-0"
          >
            {isInstalled ? '✓ APP INSTALLED' : '📲 INSTALL APP'}
          </button>
        </div>

        {statusNote && (
          <div
            data-testid="pwa-install-note"
            className="mt-2 bg-[#14532d]/60 border-2 border-[#4ade80] px-3 py-1.5 text-base font-['VT323'] text-[#f8fafc]"
          >
            {statusNote}
          </div>
        )}

        {/* 1-Click Bundle Export Buttons for Web Hosting & PWABuilder */}
        <div className="mt-3">
          <div className="text-[9px] font-['Silkscreen'] font-bold text-[#fde047] mb-1.5">
            📦 1-CLICK PWA &amp; HOSTING BUNDLE EXPORTS (GITHUB PAGES / HOSTINGER)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              data-testid="download-manifest-btn"
              onClick={() => {
                downloadTextAsset('manifest.json', KLASIK_MANIFEST_JSON_STRING, 'application/json');
                setStatusNote('✓ Downloaded manifest.json (Web App Manifest with 512x512 Red Cup icon)!');
              }}
              className="gba-btn py-2 px-2.5 text-[8px] text-[#7dd3fc] cursor-pointer"
            >
              ⬇️ MANIFEST.JSON
            </button>

            <button
              type="button"
              data-testid="download-sw-btn"
              onClick={() => {
                downloadTextAsset('sw.js', KLASIK_SW_JS_SOURCE, 'application/javascript');
                setStatusNote('✓ Downloaded sw.js (Offline-First Service Worker cache)! ');
              }}
              className="gba-btn py-2 px-2.5 text-[8px] text-[#4ade80] cursor-pointer"
            >
              ⬇️ SW.JS (OFFLINE)
            </button>

            <button
              type="button"
              data-testid="download-single-html-btn"
              onClick={() => {
                downloadTextAsset('index.html', STANDALONE_KLASIK_HTML, 'text/html');
                setStatusNote('✓ Downloaded self-contained index.html!');
              }}
              className="gba-btn gba-btn-active py-2 px-2.5 text-[8px] cursor-pointer"
            >
              ⬇️ INDEX.HTML (FULL)
            </button>
          </div>
        </div>

        {/* Step-by-Step Signed Android .APK Packaging Guide */}
        <div className="mt-3 bg-[#0b0d12] border-2 border-[#475569] p-3">
          <div className="text-[9px] font-['Silkscreen'] font-bold text-[#86efac] mb-1">
            🤖 HOW TO PACKAGE INTO A SIGNED ANDROID .APK (PWABUILDER)
          </div>
          <ol className="text-base font-['VT323'] text-[#cbd5e1] space-y-1 list-decimal list-inside">
            <li>
              Download <strong className="text-[#facc15]">index.html</strong>,{' '}
              <strong className="text-[#7dd3fc]">manifest.json</strong>, and{' '}
              <strong className="text-[#4ade80]">sw.js</strong> above and upload them to any HTTPS host
              (GitHub Pages, Hostinger, Netlify, or Vercel).
            </li>
            <li>
              Open <strong className="text-[#f8fafc]">https://www.pwabuilder.com</strong> and paste your
              live URL. PWABuilder will detect the Landscape Web App Manifest, Red Coffee Cup SVG icon,
              and Offline Service Worker.
            </li>
            <li>
              Click <strong className="text-[#facc15]">Package for Stores → Android → Generate .APK</strong>{' '}
              (or Trusted Web Activity `.aab` / `.apk`) to download your signed Android installer!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
