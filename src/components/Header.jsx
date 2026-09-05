import React from 'react';
import { Gamepad2, Search, Plus, FileCode2, ShieldAlert, Star, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Action', 'Retro', 'Sports', 'Strategy'];

export const Header = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAddModal,
  onOpenJsonModal,
  onTriggerPanic,
  totalGamesCount,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo and Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">semagdekcolbnu.co.uk</h1>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    JSON Portal
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {totalGamesCount} iframe-powered games • No ads • Instant play
                </p>
              </div>
            </div>

            {/* Mobile Panic Shortcut */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="mobilePanicBtn"
                onClick={onTriggerPanic}
                title="Stealth Panic Mode (Esc)"
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Panic</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="gameSearchInput"
              type="text"
              placeholder="Search games, tags, or authors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              id="favoritesFilterBtn"
              onClick={onToggleFavorites}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                showFavoritesOnly
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950' : 'text-amber-400'}`} />
              <span>Favorites ({favoritesCount})</span>
            </button>

            <button
              id="viewJsonBtn"
              onClick={onOpenJsonModal}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap"
              title="Inspect or export games.json"
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>games.json</span>
            </button>

            <button
              id="addGameBtn"
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Game</span>
            </button>

            <button
              id="panicButton"
              onClick={onTriggerPanic}
              title="Stealth Panic Screen (Press ESC)"
              className="hidden md:flex px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold items-center gap-1.5 transition whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Panic (Esc)</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-0.5 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat && !showFavoritesOnly;
            return (
              <button
                key={cat}
                id={`cat-${cat.toLowerCase()}`}
                onClick={() => {
                  onSelectCategory(cat);
                  if (showFavoritesOnly) onToggleFavorites();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat === 'All' && <Sparkles className="w-3 h-3 inline mr-1 text-indigo-300" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
