import { useDispatch } from 'react-redux';
import { setScrapeStatus } from '../../redux/slices/uiSlice';

export default function ScrapeStatusBar({ status }) {
  const dispatch = useDispatch();

  const colors = {
    running: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    completed: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/20 border-red-500/30 text-red-300',
  };

  const icons = { running: '⟳', completed: '✓', error: '✕' };

  return (
    <div className={`flex items-center justify-between px-6 py-2 border-b text-sm ${colors[status.status] || colors.running}`}>
      <div className="flex items-center gap-2">
        <span className={status.status === 'running' ? 'animate-spin inline-block' : ''}>{icons[status.status]}</span>
        <span>{status.message}</span>
        {status.result && (
          <span className="text-xs opacity-70">
            · {status.result.saved} new posts
          </span>
        )}
      </div>
      <button
        onClick={() => dispatch(setScrapeStatus(null))}
        className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
      >×</button>
    </div>
  );
}
