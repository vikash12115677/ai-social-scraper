import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const updatePreferences = createAsyncThunk('auth/preferences', async (prefs, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/preferences', prefs);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, handleRejected)

      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, handleRejected)

      .addCase(fetchCurrentUser.pending, handlePending)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })

      .addCase(updatePreferences.fulfilled, (state, action) => {
        if (state.user) state.user.preferences = action.payload.preferences;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
