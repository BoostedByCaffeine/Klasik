import React, { useState } from 'react';
import { STANDALONE_KLASIK_HTML } from '../game/standaloneHtml';

interface CodeExportModalProps {
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(STANDALONE_KLASIK_HTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_KLASIK_HTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'klasik-garden-cafe.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 25, 18, 0.85)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-export-title"
    >
      <div
        className="w-full max-w-3xl rounded-xl border-[4px] border-[#d4a373] p-5 text-[#fff8e7] flex flex-col max-h-[86vh]"
        style={{
          backgroundColor: '#2d1c10',
          boxShadow: '0 10px 0 #140c06',
        }}
      >
        <div className="flex items-center justify-between gap-4 pb-3 border-b-2 border-[#5c3c24]">
          <div>
            <h2 id="code-export-title" className="text-sm font-['Press_Start_2P'] text-[#ffe66d]">
              SINGLE-FILE HTML5 GAME CODE
            </h2>
            <p className="text-xs text-[#e9c46a] mt-1">
              Copy and paste into any `.html` file to run immediately in any browser with zero dependencies.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-[#5c3c24] hover:bg-[#7d5436] text-[#fff8e7] text-xs font-bold rounded border-2 border-[#d4a373] cursor-pointer"
          >
            Close [Esc]
          </button>
        </div>

        <div className="my-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-[#f5a623] hover:bg-[#ffb703] text-[#24150b] font-bold text-xs rounded-lg border-2 border-[#24150b] cursor-pointer"
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Full Single-File HTML'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-[#52b788] hover:bg-[#74c69d] text-[#132a13] font-bold text-xs rounded-lg border-2 border-[#132a13] cursor-pointer"
          >
            Download klasik-garden-cafe.html
          </button>
        </div>

        <pre className="flex-1 overflow-auto p-3 rounded-lg bg-[#161b18] border-2 border-[#4a2f1b] text-[11px] font-mono text-[#d8f3dc] select-all leading-relaxed">
          <code>{STANDALONE_KLASIK_HTML}</code>
        </pre>
      </div>
    </div>
  );
};
