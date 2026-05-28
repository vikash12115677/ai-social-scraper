import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences, logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/uiSlice';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Settings() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  const handleSavePreferences = async (prefs) => {
    try {
      await dispatch(updatePreferences(prefs)).unwrap();
      toast.success('Preferences saved!');
    } catch (err) {
      toast.error(err || 'Failed to save preferences');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setChangingPwd(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile Info */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">👤 Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 mt-1 inline-block rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">🎨 Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Theme</p>
            <p className="text-xs text-gray-500">Currently: {theme} mode</p>
          </div>
          <button
            onClick={() => {
              dispatch(toggleTheme());
              handleSavePreferences({ ...user?.preferences, theme: theme === 'dark' ? 'light' : 'dark' });
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">🔔 Notifications</h2>
        {[
          { key: 'notifications', label: 'Real-time post alerts', desc: 'Get notified when new posts arrive' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => handleSavePreferences({ ...user?.preferences, [item.key]: !user?.preferences?.[item.key] })}
              className={`relative w-12 h-6 rounded-full transition-colors ${user?.preferences?.[item.key] ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${user?.preferences?.[item.key] ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Change Password */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">🔒 Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { field: 'currentPassword', label: 'Current Password' },
            { field: 'newPassword', label: 'New Password' },
            { field: 'confirmPassword', label: 'Confirm New Password' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="text-xs text-gray-400 mb-1 block">{label}</label>
              <input type="password" value={passwordForm[field]}
                onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                className="input-field" placeholder="••••••••" />
            </div>
          ))}
          <button type="submit" disabled={changingPwd} className="btn-primary">
            {changingPwd ? '⟳ Changing...' : '🔒 Change Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-5 border border-red-500/20 space-y-3">
        <h2 className="text-sm font-semibold text-red-400 flex items-center gap-2">⚠️ Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Sign out</p>
            <p className="text-xs text-gray-500">Log out of this device</p>
          </div>
          <button onClick={() => dispatch(logout())} className="btn-secondary text-red-400 border-red-500/30 hover:bg-red-500/10">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
