import React, { useState, useRef } from 'react';
import { ArrowLeft, RotateCw, Maximize, Minimize, ExternalLink, Star, Keyboard, Tag, Info, AlertCircle } from 'lucide-react';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectOtherGame,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const playerContainerRef = useRef(null);

  const handleReload = () => {
    setIsLoading(true);
    setLoadError(false);
    setIframeKey(prev => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleOpenInNewTab = () => {
    const newWin = window.open('about:blank', '_blank');
    if (newWin) {
      newWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${game.title} - semagdekcolbnu.co.uk</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
            iframe { border: none; width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <iframe src="${game.iframeUrl}" allow="fullscreen; gamepad; autoplay" allowfullscreen></iframe>
        </body>
        </html>
      `);
      newWin.document.close();
    } else {
      window.open(game.iframeUrl, '_blank');
    }
  };

  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || g.featured))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="backToGamesBtn"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-2 text-sm font-medium cursor-pointer"
            title="Back to games catalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Games</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{game.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700 font-medium">
                {game.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {game.author ? `Developed by ${game.author}` : 'HTML5 Web Game'}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="favoriteGameBtn"
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`p-2 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            id="reloadIframeBtn"
            onClick={handleReload}
            title="Reload Game"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 text-sm cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden md:inline">Restart</span>
          </button>

          <button
            id="theaterModeBtn"
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? "Normal View" : "Theater Mode"}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 text-sm cursor-pointer"
          >
            {isTheater ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden md:inline">{isTheater ? 'Exit Theater' : 'Theater'}</span>
          </button>

          <button
            id="fullscreenBtn"
            onClick={handleToggleFullscreen}
            title="Fullscreen"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5 text-sm shadow-sm cursor-pointer"
          >
            <Maximize className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            id="openPopoutBtn"
            onClick={handleOpenInNewTab}
            title="Open in stealth tab (about:blank)"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Iframe Player Area */}
      <div
        ref={playerContainerRef}
        id="gamePlayerContainer"
        className={`relative mx-auto transition-all duration-300 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl ${
          isTheater ? 'w-full' : 'max-w-5xl'
        }`}
        style={{
          aspectRatio: game.aspectRatio === '1/1' ? '1/1' : game.aspectRatio === '16/9' ? '16/9' : '4/3',
          maxHeight: isTheater ? '85vh' : '70vh',
          minHeight: '440px'
        }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-10">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-300">Loading {game.title} iframe...</p>
            <p className="text-xs text-slate-500 mt-1">Direct local container • Zero lag</p>
          </div>
        )}

        {/* Error Fallback */}
        {loadError && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-20 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Failed to load game iframe</h3>
            <p className="text-sm text-slate-400 max-w-md mb-4">
              The game source at <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">{game.iframeUrl}</code> could not be displayed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg"
              >
                Retry Loading
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700"
              >
                Open in New Window
              </button>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={iframeKey}
          id="activeGameIframe"
          src={game.iframeUrl}
          title={game.title}
          className="w-full h-full border-0 block bg-slate-900"
          allow="fullscreen; gamepad; autoplay; clipboard-write; focus-without-user-activation *"
          allowFullScreen
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setIsLoading(false);
            setLoadError(true);
          }}
        />
      </div>

      {/* Game Details & Controls Bar */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Description & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-sm">
              <Info className="w-4 h-4" />
              <span>About {game.title}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {game.description}
            </p>

            {/* Controls Guide */}
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-slate-300 font-medium text-xs uppercase tracking-wider">
                <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Controls & How to Play</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {game.controls && game.controls.length > 0 ? (
                  game.controls.map((ctrl, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg text-xs text-slate-200 border border-slate-700/50"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{ctrl}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">Standard mouse and arrow keys controls.</div>
                )}
              </div>
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                {game.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-900/60 text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Related Games */}
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">More Like This</h3>
            <div className="space-y-2.5">
              {relatedGames.map((rg) => (
                <div
                  key={rg.id}
                  onClick={() => onSelectOtherGame(rg)}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${rg.thumbnailGradient || 'from-indigo-600 to-slate-800'} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                      {rg.title.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition">
                        {rg.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{rg.category}</p>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white text-xs font-medium transition cursor-pointer">
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
