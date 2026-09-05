import React from 'react';
import { Play, Star, Sparkles, Gamepad2, Grid, Zap, Boxes, Feather, Crosshair, Trophy, Shield, AlertTriangle, Hexagon, Gauge } from 'lucide-react';

const ICON_MAP = {
  Gamepad2: <Gamepad2 className="w-8 h-8 text-white/90" />,
  Grid: <Grid className="w-8 h-8 text-white/90" />,
  Zap: <Zap className="w-8 h-8 text-white/90" />,
  Boxes: <Boxes className="w-8 h-8 text-white/90" />,
  Feather: <Feather className="w-8 h-8 text-white/90" />,
  Crosshair: <Crosshair className="w-8 h-8 text-white/90" />,
  Trophy: <Trophy className="w-8 h-8 text-white/90" />,
  Shield: <Shield className="w-8 h-8 text-white/90" />,
  AlertTriangle: <AlertTriangle className="w-8 h-8 text-white/90" />,
  Hexagon: <Hexagon className="w-8 h-8 text-white/90" />,
  Gauge: <Gauge className="w-8 h-8 text-white/90" />,
};

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite
}) => {
  const gradientClass = game.thumbnailGradient || 'from-indigo-600 to-slate-800';

  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail Banner */}
      <div className={`relative h-40 bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Center Icon */}
        <div className="relative z-10 transform group-hover:scale-110 transition duration-300 drop-shadow-md">
          {game.icon && ICON_MAP[game.icon] ? ICON_MAP[game.icon] : <Gamepad2 className="w-8 h-8 text-white/90" />}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:scale-110 transition"
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/70 backdrop-blur-sm text-slate-200 border border-white/10">
            {game.category}
          </span>
          {game.featured && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-slate-950 flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              HOT
            </span>
          )}
          {game.isCustom && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-slate-950">
              CUSTOM
            </span>
          )}
        </div>

        {/* Hover Play Overlay */}
        <div
          onClick={() => onPlay(game)}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition duration-200">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-base text-slate-100 group-hover:text-indigo-300 transition">
              {game.title}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        <div>
          {/* Controls hint badge */}
          {game.controls && game.controls.length > 0 && (
            <div className="text-[11px] text-slate-400 bg-slate-900/50 rounded-lg px-2.5 py-1.5 mb-3 border border-slate-700/50 truncate">
              <span className="text-slate-500 font-semibold mr-1">Controls:</span>
              {game.controls[0]}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs">
            <span className="text-slate-500 truncate max-w-[140px]">
              {game.author || 'Open Source'}
            </span>
            <button
              id={`play-btn-${game.id}`}
              onClick={() => onPlay(game)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium flex items-center gap-1.5 transition text-xs shadow-sm active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
