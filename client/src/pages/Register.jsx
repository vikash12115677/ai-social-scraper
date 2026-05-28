import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser, clearError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(clearError());
    try {
      await dispatch(registerUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      toast.success('Account created! Welcome aboard 🎉');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-3xl mb-4">🛂</div>
          <h1 className="text-2xl font-bold text-white">Passport Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">Create your free account</p>
        </div>

        <div className="glass-card p-8 space-y-5">
          <h2 className="text-lg font-semibold text-white">Create an account</h2>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { field: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
                <input type={type} value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input-field" placeholder={placeholder} required />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? <span className="animate-spin">⟳</span> : '✨'} {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
