import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPosts = createAsyncThunk('posts/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/posts', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch posts');
  }
});

export const fetchPostStats = createAsyncThunk('posts/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/posts/stats');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const searchPosts = createAsyncThunk('posts/search', async (searchData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/posts/search', searchData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const savePost = createAsyncThunk('posts/save', async (postId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/posts/${postId}/save`);
    return { postId, saved: data.saved };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const fetchSavedPosts = createAsyncThunk('posts/saved', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/posts/saved', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    savedPosts: [],
    pagination: null,
    stats: null,
    filters: {
      platform: '',
      sentiment: '',
      category: '',
      language: '',
      region: '',
      sortBy: 'postedAt',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
    },
    searchQuery: '',
    loading: false,
    searchLoading: false,
    error: null,
    newPostsCount: 0,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addNewPosts: (state, action) => {
      state.newPostsCount += action.payload.length;
      // Prepend new posts at top
      state.items = [...action.payload, ...state.items].slice(0, 100);
    },
    clearNewPostsCount: (state) => {
      state.newPostsCount = 0;
    },
    resetFilters: (state) => {
      state.filters = {
        platform: '', sentiment: '', category: '', language: '',
        region: '', sortBy: 'postedAt', sortOrder: 'desc', page: 1, limit: 20,
      };
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      .addCase(searchPosts.pending, (state) => { state.searchLoading = true; })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.items = action.payload.posts;
        state.pagination = { total: action.payload.total, page: 1, limit: 20, pages: Math.ceil(action.payload.total / 20) };
      })
      .addCase(searchPosts.rejected, (state) => { state.searchLoading = false; })

      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.savedPosts = action.payload.posts;
      });
  },
});

export const { setFilter, setPage, setSearchQuery, addNewPosts, clearNewPostsCount, resetFilters } = postsSlice.actions;
export default postsSlice.reducer;
