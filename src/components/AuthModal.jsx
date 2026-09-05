import React, { useState } from 'react';
import { useAuth, AVATAR_OPTIONS } from '../context/AuthContext.jsx';
import { X, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2, ArrowRight, LogIn, UserPlus, KeyRound } from 'lucide-react';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { signup, login, loginWithGoogle, resetPassword, authError, setAuthError } = useAuth();
  
  // Modes: 'login', 'signup', 'reset'
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('controller');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    setResetSent(false);

    try {
      if (mode === 'signup') {
        if (!email || !password) throw new Error('Please fill in all required fields.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await signup(email, password, displayName, selectedAvatar);
        onClose();
      } else if (mode === 'login') {
        if (!email || !password) throw new Error('Please enter both email and password.');
        await login(email, password);
        onClose();
      } else if (mode === 'reset') {
        if (!email) throw new Error('Please enter your account email.');
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err) {
      // Error handled by AuthContext or local catch
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyErrorMessage = (error) => {
    if (!error) return null;
    if (typeof error === 'string') {
      if (error.includes('user-not-found') || error.includes('wrong-password') || error.includes('invalid-credential')) {
        return 'Invalid email or password combination.';
      }
      if (error.includes('email-already-in-use')) {
        return 'An account with this email already exists. Try signing in instead.';
      }
      if (error.includes('weak-password')) {
        return 'Password should be at least 6 characters.';
      }
      if (error.includes('popup-closed-by-user')) {
        return 'Sign in popup was closed. Please try again.';
      }
      return error.replace('Firebase: ', '');
    }
    return 'An authentication error occurred. Please try again.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500" />

        {/* Modal Top Bar */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>semagdekcolbnu.co.uk Account</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {mode === 'login' && 'Welcome Back, Gamer'}
              {mode === 'signup' && 'Create Your Player Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' && 'Sign in to sync your favorites, custom games, and stats.'}
              {mode === 'signup' && 'Cloud-save your games and custom library across all devices.'}
              {mode === 'reset' && 'Enter your email to receive a password reset link.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Login / Sign Up) */}
        {mode !== 'reset' && (
          <div className="px-6 pt-2">
            <div className="grid grid-cols-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setAuthError(null); }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  mode === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setAuthError(null); }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  mode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          
          {/* Feedback error alert */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{getFriendlyErrorMessage(authError)}</span>
            </div>
          )}

          {/* Reset Sent Success Notice */}
          {resetSent && mode === 'reset' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Password reset instructions have been dispatched to {email}. Check your inbox or spam.</span>
            </div>
          )}

          {/* Username & Avatar picker (Only in Signup Mode) */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Player Tag / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. PixelHero"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Choose Player Badge
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${av.bg} transition ${
                        selectedAvatar === av.id
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      title={av.label}
                    >
                      <span>{av.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password field (only if not reset mode) */}
          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setAuthError(null); }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-slate-500 mt-1">
                  At least 6 characters required.
                </p>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Gamer Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Alternative Google Sign In */}
          {mode !== 'reset' && (
            <>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </>
          )}

          {/* Switch back to login from reset */}
          {mode === 'reset' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setResetSent(false); setAuthError(null); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
