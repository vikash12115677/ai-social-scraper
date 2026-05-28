import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../../redux/slices/postsSlice';

const PLATFORMS = ['twitter', 'reddit', 'youtube', 'linkedin', 'instagram', 'facebook', 'tiktok'];
const SENTIMENTS = ['positive', 'negative', 'neutral'];
const CATEGORIES = [
  'Passport Application', 'Passport Renewal', 'Tatkal', 'Visa',
  'Travel Issues', 'Government Announcements', 'Scam/Fraud', 'News', 'Personal Experiences',
];
const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' },
  { code: 'pa', name: 'Punjabi' }, { code: 'es', name: 'Spanish' },
];
const SORT_OPTIONS = [
  { value: 'postedAt', label: 'Newest First' },
  { value: 'engagementScore', label: 'Most Engaged' },
  { value: 'sentimentScore', label: 'Sentiment' },
];

export default function FilterBar({ onClose }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((s) => s.posts);

  const update = (key, val) => dispatch(setFilter({ [key]: val === filters[key] ? '' : val }));

  const FilterChip = ({ label, active, onClick, color = 'blue' }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? `bg-${color}-600/30 border-${color}-500/50 text-${color}-300`
          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="glass-card p-5 space-y-5 animate-slide-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Filters</h3>
        <div className="flex gap-2">
          <button onClick={() => dispatch(resetFilters())} className="text-xs text-gray-400 hover:text-white transition-colors">
            Reset all
          </button>
          {onClose && <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">×</button>}
        </div>
      </div>

      {/* Platform */}
      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Platform</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <FilterChip key={p} label={p.charAt(0).toUpperCase() + p.slice(1)}
              active={filters.platform?.includes(p)} onClick={() => update('platform', p)} />
          ))}
        </div>
      </div>

      {/* Sentiment */}
      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Sentiment</p>
        <div className="flex gap-2">
          {SENTIMENTS.map((s) => (
            <FilterChip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}
              active={filters.sentiment?.includes(s)} onClick={() => update('sentiment', s)}
              color={s === 'positive' ? 'green' : s === 'negative' ? 'red' : 'yellow'} />
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <FilterChip key={c} label={c} active={filters.category?.includes(c)} onClick={() => update('category', c)} />
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Language</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <FilterChip key={l.code} label={l.name}
              active={filters.language?.includes(l.code)} onClick={() => update('language', l.code)} />
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Sort By</p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <FilterChip key={opt.value} label={opt.label}
              active={filters.sortBy === opt.value} onClick={() => dispatch(setFilter({ sortBy: opt.value }))} />
          ))}
        </div>
      </div>
    </div>
  );
}
