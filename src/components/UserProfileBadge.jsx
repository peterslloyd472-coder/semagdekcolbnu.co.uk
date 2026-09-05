import React, { useState, useRef, useEffect } from 'react';
import { useAuth, AVATAR_OPTIONS } from '../context/AuthContext.jsx';
import { LogIn, User, LogOut, Star, Gamepad2, Sparkles, Check, ChevronDown } from 'lucide-react';

export function UserProfileBadge({ onOpenAuthModal }) {
  const { currentUser, userProfile, logout, updateUserData } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setEditingAvatar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          id="signInBtn"
          onClick={() => onOpenAuthModal('login')}
          className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <LogIn className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sign In</span>
        </button>
        <button
          id="signUpBtn"
          onClick={() => onOpenAuthModal('signup')}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>Sign Up</span>
        </button>
      </div>
    );
  }

  // Find avatar config
  const currentAvatarId = userProfile?.avatar || 'controller';
  const avatarConfig = AVATAR_OPTIONS.find(a => a.id === currentAvatarId) || AVATAR_OPTIONS[0];

  const handleSelectAvatar = async (avatarId) => {
    await updateUserData({ avatar: avatarId });
    setEditingAvatar(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="userProfileTrigger"
        onClick={() => setDropdownOpen(prev => !prev)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 transition cursor-pointer text-left"
      >
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${avatarConfig.bg} flex items-center justify-center text-sm shadow-sm`}>
          <span>{avatarConfig.emoji}</span>
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-semibold text-white leading-tight max-w-[110px] truncate">
            {userProfile?.displayName || currentUser.displayName || 'Player'}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium leading-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud Synced</span>
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Profile Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-3 space-y-3">
          {/* User Card Header */}
          <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarConfig.bg} flex items-center justify-center text-xl shadow`}>
              <span>{avatarConfig.emoji}</span>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">
                {userProfile?.displayName || currentUser.displayName || 'Player'}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{userProfile?.favorites?.length || 0}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Saved Favs</div>
            </div>
            <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-indigo-400 flex items-center justify-center gap-1">
                <Gamepad2 className="w-3 h-3 text-indigo-400" />
                <span>{userProfile?.customGames?.length || 0}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Custom Added</div>
            </div>
          </div>

          {/* Avatar selector toggle */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5 px-1">
              <span>Change Avatar Badge</span>
            </div>
            <div className="grid grid-cols-6 gap-1 p-1 bg-slate-950/50 rounded-xl border border-slate-800/60">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av.id)}
                  title={av.label}
                  className={`h-8 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${av.bg} transition ${
                    currentAvatarId === av.id ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-2">
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
