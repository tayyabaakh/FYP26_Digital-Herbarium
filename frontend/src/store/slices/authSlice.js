import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMeApi, loginApi } from '../../api/authApi';

// ── Async: Login ──────────────────────────────────────────────
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi(email, password);
      // Persist to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// ── Async: Restore session on page reload ─────────────────────
export const loadUserThunk = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token');
      // Verify token is still valid with backend
      const data = await getMeApi();
      return { user: data.user, token };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired');
    }
  }
);

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  user:            null,
  token:           localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading:         false,
  error:           null,
};

// ── Slice ─────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manual login success (if needed outside thunk)
    loginSuccess(state, action) {
      state.user            = action.payload.user;
      state.token           = action.payload.token;
      state.isAuthenticated = true;
      state.error           = null;
    },
    // Logout — clears everything
    logout(state) {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      state.error           = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // Clear any auth errors
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── Login ───────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading         = false;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // ── Load User (page reload) ─────────────────────────────
    builder
      .addCase(loadUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.loading         = false;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loadUserThunk.rejected, (state) => {
        state.loading         = false;
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
      });
  },
});

export const { loginSuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer;