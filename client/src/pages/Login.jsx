import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(loginUser(form)).unwrap();
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@passport-dashboard.com', password: 'admin123' });
    else setForm({ email: 'demo@passport-dashboard.com', password: 'demo123' });
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-3xl mb-4">
            🛂
          </div>
          <h1 className="text-2xl font-bold text-white">Passport Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">AI-powered social media intelligence</p>
        </div>

        <div className="glass-card p-8 space-y-5">
          <h2 className="text-lg font-semibold text-white">Sign in to your account</h2>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <input type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base">
              {loading ? <span className="animate-spin">⟳</span> : '🔑'} {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-2">Quick demo access:</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo('admin')}
                className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-all">
                👑 Admin Demo
              </button>
              <button onClick={() => fillDemo('user')}
                className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-all">
                👤 User Demo
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
