import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPostStats, addNewPosts } from '../redux/slices/postsSlice';
import { setScrapeStatus } from '../redux/slices/uiSlice';
import { connectSocket, disconnectSocket } from '../services/socketService';

// Debounce hook
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = useCallback((value) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key]);
  return [storedValue, setValue];
};

// Socket hook for real-time updates
export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) return;
    const socket = connectSocket(user.id);

    socket.on('new-posts', ({ posts }) => {
      dispatch(addNewPosts(posts));
    });

    socket.on('scrape-status', (status) => {
      dispatch(setScrapeStatus(status));
    });

    return () => {
      socket.off('new-posts');
      socket.off('scrape-status');
      disconnectSocket();
    };
  }, [user, dispatch]);
};

// Posts hook with auto-refresh
export const usePosts = () => {
  const dispatch = useDispatch();
  const { filters, loading, items, pagination, stats } = useSelector((s) => s.posts);

  const loadPosts = useCallback(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchPosts(params));
  }, [filters, dispatch]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    dispatch(fetchPostStats());
  }, [dispatch]);

  return { posts: items, loading, pagination, stats, reload: loadPosts };
};

// Intersection Observer for infinite scroll
export const useInfiniteScroll = (callback) => {
  const observerRef = useRef(null);
  const lastElementRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) callback();
    });
    if (node) observerRef.current.observe(node);
  }, [callback]);
  return lastElementRef;
};
