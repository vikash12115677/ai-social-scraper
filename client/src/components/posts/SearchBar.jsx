import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { searchPosts, fetchPosts, setSearchQuery } from '../../redux/slices/postsSlice';
import { useDebounce } from '../../hooks';

export default function SearchBar({ placeholder = 'Search posts, hashtags, usernames...' }) {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedValue));
    if (debouncedValue.trim().length >= 2) {
      dispatch(searchPosts({ query: debouncedValue }));
    } else if (debouncedValue.trim().length === 0) {
      dispatch(fetchPosts({ page: 1, limit: 20 }));
    }
  }, [debouncedValue, dispatch]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => { setValue(''); dispatch(fetchPosts({ page: 1, limit: 20 })); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm transition-colors"
        >×</button>
      )}
    </div>
  );
}
