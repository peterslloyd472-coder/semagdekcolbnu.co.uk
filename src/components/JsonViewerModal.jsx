import React, { useState } from 'react';
import { X, Copy, Check, Download, RefreshCw, Upload, FileCode2 } from 'lucide-react';

export const JsonViewerModal = ({
  isOpen,
  onClose,
  games,
  onImportJson,
  onResetDefaults
}) => {
  const [copied, setCopied] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array of game objects.');
      }
      for (const item of parsed) {
        if (!item.id || !item.title || !item.iframeUrl) {
          throw new Error('Each game object must have at least "id", "title", and "iframeUrl".');
        }
      }
      onImportJson(parsed);
      setIsImportMode(false);
      setImportText('');
    } catch (err) {
      setImportError(err.message || 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">games.json Database</h3>
              <p className="text-xs text-slate-400">
                {games.length} games stored with iframe configurations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isImportMode ? (
              <>
                <button
                  onClick={() => setIsImportMode(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Import custom JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Download games.json"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsImportMode(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Back to Viewer
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden my-4">
          {!isImportMode ? (
            <div className="h-full overflow-auto bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300">
              <pre className="text-emerald-400 leading-relaxed select-all">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col gap-3">
              <p className="text-xs text-slate-400">
                Paste valid JSON containing an array of game objects with <code className="text-indigo-300">title</code> and <code className="text-indigo-300">iframeUrl</code>:
              </p>
              {importError && (
                <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {importError}
                </div>
              )}
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="[ { &quot;id&quot;: &quot;custom-1&quot;, &quot;title&quot;: &quot;My Game&quot;, &quot;iframeUrl&quot;: &quot;...&quot; } ]"
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                onClick={handleImportSubmit}
                className="self-end px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Apply Imported JSON
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-500">
          <span>File location: <code className="text-indigo-400">/public/games.json</code></span>
          <button
            onClick={() => {
              if (window.confirm('Reset catalog back to the original default games list?')) {
                onResetDefaults();
                onClose();
              }
            }}
            className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Original Defaults</span>
          </button>
        </div>

      </div>
    </div>
  );
};
