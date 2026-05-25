'use client';
import { useState, useEffect } from 'react';
import API_URL from '@/config/config';

const LABEL = 'block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1';
const INPUT = 'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-sm placeholder:text-stone-400';

interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  role: string;
  hasPassword: boolean;
}

type Message = { type: 'success' | 'error'; text: string };

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadError, setLoadError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/settings`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile(data);
        setUsername(data.username || '');
        setEmail(data.email || '');
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setProfile(prev => prev ? { ...prev, username: data.username, email: data.email } : prev);
      setProfileMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err: unknown) {
      setProfileMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ type: 'success', text: 'Password updated.' });
    } catch (err: unknown) {
      setPasswordMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const isGoogleAvatar = profile?.avatar && profile.avatar.startsWith('http');
  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : profile?.email
    ? profile.email.slice(0, 2).toUpperCase()
    : '?';

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-red-500 text-sm">{loadError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-stone-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-stone-800 mb-2">Profile</h1>
        <div className="h-px bg-stone-200" />
      </div>

      <div className="flex items-center gap-5">
        {isGoogleAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-stone-200" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-stone-800 text-white flex items-center justify-center text-xl font-semibold select-none">
            {initials}
          </div>
        )}
        <div>
          <p className="text-lg font-serif text-stone-800">{profile.username}</p>
          <p className="text-sm text-stone-500">{profile.email}</p>
          {profile.role === 'admin' && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-stone-800 text-white rounded-full tracking-wide">
              Admin
            </span>
          )}
        </div>
      </div>

      <div className="border border-stone-200 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-widest">Edit Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className={LABEL}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={INPUT}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className={LABEL}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT}
              placeholder="you@example.com"
            />
          </div>
          {profileMessage && (
            <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {profileMessage.text}
            </p>
          )}
          <button
            type="submit"
            disabled={profileSaving}
            className="bg-stone-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-stone-700 transition-colors disabled:opacity-60"
          >
            {profileSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {profile.hasPassword && (
        <div className="border border-stone-200 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-widest">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className={LABEL}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={INPUT}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className={LABEL}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={INPUT}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={LABEL}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={INPUT}
                autoComplete="new-password"
              />
            </div>
            {passwordMessage && (
              <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {passwordMessage.text}
              </p>
            )}
            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-stone-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-stone-700 transition-colors disabled:opacity-60"
            >
              {passwordSaving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
