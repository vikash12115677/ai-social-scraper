import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../../redux/slices/postsSlice';

export default function Pagination() {
  const dispatch = useDispatch();
  const { pagination, filters } = useSelector((s) => s.posts);

  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNums = () => {
    const nums = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(pages, page + 2);
    if (start > 1) { nums.push(1); if (start > 2) nums.push('...'); }
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < pages) { if (end < pages - 1) nums.push('...'); nums.push(pages); }
    return nums;
  };

  const btnBase = 'w-9 h-9 rounded-lg text-sm font-medium transition-all';
  const btnActive = 'bg-blue-600 text-white';
  const btnInactive = 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10';
  const btnDisabled = 'opacity-30 cursor-not-allowed bg-white/5 text-gray-600 border border-white/5';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
      <p className="text-xs text-gray-500">
        Showing <span className="text-gray-300">{start}–{end}</span> of <span className="text-gray-300">{total}</span> posts
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnInactive}`}
        >←</button>

        {getPageNums().map((num, i) =>
          num === '...' ? (
            <span key={`el-${i}`} className="w-9 text-center text-gray-500">…</span>
          ) : (
            <button
              key={num}
              onClick={() => dispatch(setPage(num))}
              className={`${btnBase} ${num === page ? btnActive : btnInactive}`}
            >{num}</button>
          )
        )}

        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page === pages}
          className={`${btnBase} ${page === pages ? btnDisabled : btnInactive}`}
        >→</button>
      </div>
    </div>
  );
}
