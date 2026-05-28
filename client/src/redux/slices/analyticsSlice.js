import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/analytics/overview', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const fetchTrending = createAsyncThunk('analytics/trending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/analytics/trending');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    overview: null,
    trending: null,
    loading: false,
    error: null,
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  },
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      });
  },
});

export const { setDateRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;
