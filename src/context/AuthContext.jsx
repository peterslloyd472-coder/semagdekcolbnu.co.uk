import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase.js';

const AuthContext = createContext(null);

export const AVATAR_OPTIONS = [
  { id: 'controller', label: 'Controller', emoji: '🎮', bg: 'from-indigo-500 to-purple-600' },
  { id: 'fire', label: 'Fire', emoji: '🔥', bg: 'from-amber-500 to-red-600' },
  { id: 'ninja', label: 'Ninja', emoji: '🥷', bg: 'from-slate-700 to-slate-900' },
  { id: 'skull', label: 'Arcade', emoji: '👾', bg: 'from-emerald-500 to-cyan-600' },
  { id: 'robot', label: 'Bot', emoji: '🤖', bg: 'from-cyan-500 to-blue-600' },
  { id: 'crown', label: 'Pro', emoji: '👑', bg: 'from-yellow-400 to-amber-600' }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // First time setup profile in Firestore
            const initialProfile = {
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Player',
              avatar: 'controller',
              favorites: ['snake-retro', 'highway-traffic', '2048-puzzle'],
              customGames: [],
              recentPlayed: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with Email and Password
  const signup = async (email, password, displayName = '', avatarId = 'controller') => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const cleanName = displayName.trim() || email.split('@')[0];

      await updateProfile(user, { displayName: cleanName });

      const newProfile = {
        userId: user.uid,
        email: user.email,
        displayName: cleanName,
        avatar: avatarId,
        favorites: ['snake-retro', 'highway-traffic', '2048-puzzle'],
        customGames: [],
        recentPlayed: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Sign in with Email and Password
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Google Sign In (Popup)
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        const initialProfile = {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Player',
          avatar: 'crown',
          favorites: ['snake-retro', 'highway-traffic', '2048-puzzle'],
          customGames: [],
          recentPlayed: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, initialProfile);
        setUserProfile(initialProfile);
      }
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Update profile fields (favorites, custom games, recentPlayed, avatar, etc)
  const updateUserData = async (updates) => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const payload = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(userDocRef, payload);
      setUserProfile(prev => ({ ...prev, ...payload }));
    } catch (err) {
      console.error('Failed to update user profile in Firestore:', err);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    authError,
    setAuthError,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
