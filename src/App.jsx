import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { PanicScreen } from './components/PanicScreen.jsx';
import { Sparkles, Gamepad2, Search, SlidersHorizontal, Grid, List, Star, ShieldCheck, Heart } from 'lucide-react';

const STORAGE_GAMES_KEY = 'semagdekcolbnu_games_v1';
const STORAGE_FAVS_KEY = 'semagdekcolbnu_favs_v1';

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GAMES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved games:", e);
    }
    return DEFAULT_GAMES;
  });

  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVS_KEY);
      return saved ? JSON.parse(saved) : ['snake-retro', '2048-puzzle', 'dino-runner'];
    } catch {
      return ['snake-retro', '2048-puzzle'];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Sync games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
    } catch (e) {
      console.error("Failed to save games to localStorage:", e);
    }
  }, [games]);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, [favorites]);

  // Panic hotkey listener (ESC key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPanicActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = (gameId) => {
    setFavorites(prev =>
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handleAddGame = (newGame) => {
    setGames(prev => [newGame, ...prev]);
  };

  const handleImportJson = (newGames) => {
    setGames(newGames);
  };

  const handleResetDefaults = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem(STORAGE_GAMES_KEY);
  };

  // Filter & sort games
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Category filter
        if (selectedCategory !== 'All' && game.category !== selectedCategory) {
          return false;
        }

        // Favorites filter
        if (showFavoritesOnly && !favorites.includes(game.id)) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = game.title.toLowerCase().includes(q);
          const matchesDesc = game.description.toLowerCase().includes(q);
          const matchesCategory = game.category.toLowerCase().includes(q);
          const matchesTags = game.tags?.some(t => t.toLowerCase().includes(q));
          const matchesAuthor = game.author?.toLowerCase().includes(q);
          return matchesTitle || matchesDesc || matchesCategory || matchesTags || matchesAuthor;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        }
        if (sortBy === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [games, selectedCategory, showFavoritesOnly, searchQuery, favorites, sortBy]);

  // Featured games (top banner)
  const featuredGames = useMemo(() => {
    return games.filter(g => g.featured).slice(0, 3);
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Panic Stealth Disguise Screen */}
      {isPanicActive && (
        <PanicScreen onExitPanic={() => setIsPanicActive(false)} />
      )}

      {/* Primary Navigation Bar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        totalGamesCount={games.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeGame ? (
          /* Active Game Player Mode */
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
            allGames={games}
            onSelectOtherGame={(newGame) => setActiveGame(newGame)}
          />
        ) : (
          /* Games Catalog & Grid View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            
            {/* Featured Hero Banner (Only when on 'All' with no active search) */}
            {selectedCategory === 'All' && !searchQuery && !showFavoritesOnly && (
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Play • JSON-Powered Hub</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                    Play Classic Unblocked Games on semagdekcolbnu.co.uk
                  </h2>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                    Zero installations, zero trackers, and zero firewalls. Every game runs in an isolated iframe loaded from our lightweight JSON index.
                  </p>
                  
                  {/* Quick Launch Featured Row */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Trending:</span>
                    {featuredGames.map(fg => (
                      <button
                        key={fg.id}
                        onClick={() => setActiveGame(fg)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white border border-slate-700/80 text-xs font-medium text-slate-200 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Gamepad2 className="w-3 h-3 text-indigo-400" />
                        <span>{fg.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Sub-bar: Results Counter & View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Showing</span>
                <strong className="text-slate-100 font-semibold">{filteredGames.length}</strong>
                <span>{filteredGames.length === 1 ? 'game' : 'games'}</span>
                {showFavoritesOnly && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400" /> Favorites
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {selectedCategory}
                  </span>
                )}
              </div>

              {/* View & Sort Controls */}
              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="popular">Popular First</option>
                    <option value="alpha">Alphabetical (A-Z)</option>
                  </select>
                </div>

                {/* View toggle button */}
                <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                    className={`p-1.5 rounded-md transition cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    title="Compact view"
                    className={`p-1.5 rounded-md transition cursor-pointer ${viewMode === 'compact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Games Grid or List View */}
            {filteredGames.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                }
              >
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={(g) => setActiveGame(g)}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-200 mb-1">No games found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
                  No games matched your current filters or search term &ldquo;{searchQuery}&rdquo;.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setShowFavoritesOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Add Custom Game
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">semagdekcolbnu.co.uk</span>
            <span>•</span>
            <span>All games stored as standalone iframe embeds</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View games.json</span>
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Press ESC anytime for Stealth Mode</span>
            </span>
            <span className="hidden md:inline flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for gamers
            </span>
          </div>
        </div>
      </footer>

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* JSON Viewer & Importer Modal */}
      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportJson={handleImportJson}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
