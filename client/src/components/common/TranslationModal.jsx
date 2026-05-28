import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { closeTranslationModal, setTranslation } from '../../redux/slices/uiSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
];

export default function TranslationModal() {
  const dispatch = useDispatch();
  const { post, translation } = useSelector((s) => s.ui.translationModal);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!post) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/translate/${post._id}`, { targetLanguage: selectedLang });
      dispatch(setTranslation(data.translation));
    } catch {
      toast.error('Translation failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => dispatch(closeTranslationModal())}
      >
        <motion.div
          className="glass-card w-full max-w-lg p-6 space-y-4"
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">🌐 Translate Post</h3>
            <button onClick={() => dispatch(closeTranslationModal())} className="text-gray-400 hover:text-white text-xl">×</button>
          </div>

          {post && (
            <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300 max-h-32 overflow-y-auto">
              {post.content?.substring(0, 300)}{post.content?.length > 300 ? '...' : ''}
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Translate to:</label>
            <div className="grid grid-cols-5 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${
                    selectedLang === lang.code
                      ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="mt-1 truncate w-full text-center">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {translation && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-100">
              <p className="text-xs text-blue-400 mb-1">Translation:</p>
              {translation}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleTranslate}
              disabled={loading}
              className="btn-primary flex-1 justify-center"
            >
              {loading ? <span className="animate-spin">⟳</span> : '🌐'} {loading ? 'Translating...' : 'Translate'}
            </button>
            <button onClick={() => dispatch(closeTranslationModal())} className="btn-secondary">Cancel</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
