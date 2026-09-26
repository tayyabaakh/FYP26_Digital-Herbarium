import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi, loginApi } from "../../api/authApi";

// ============================================================
// LOGIN
// ============================================================
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi(email, password);

      // Persist successful session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Incorrect email or password. Please try again."
      );
    }
  }
);

// ============================================================
// RESTORE EXISTING SESSION
// ============================================================
export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // No existing session
      if (!token) {
        return rejectWithValue("No token");
      }

      // Verify token with backend
      const data = await getMeApi();

      // Keep local storage user synchronized
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        user: data.user,
        token,
      };
    } catch (error) {
      // Invalid/expired session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

let parsedUser = null;

try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error(
    "Failed to parse user from localStorage:",
    error
  );
}

const initialState = {
  user: parsedUser,
  token: storedToken || null,

  // Authentication state
  isAuthenticated: !!storedToken && !!parsedUser,

  // ONLY for initial session restoration
  initializing: !!storedToken,

  // ONLY for login request
  loginLoading: false,

  // Authentication error
  error: null,
};

// ============================================================
// SLICE
// ============================================================
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.initializing = false;
      state.loginLoading = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // LOGIN
    // ========================================================
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loginLoading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loginLoading = false;

        state.error =
          action.payload ||
          "Incorrect email or password. Please try again.";

        /*
         * Important:
         * A failed login must never leave an old authenticated
         * state behind.
         */
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });

    // ========================================================
    // SESSION RESTORATION
    // ========================================================
    builder
      .addCase(loadUserThunk.pending, (state) => {
        /*
         * IMPORTANT:
         * Do NOT touch loginLoading here.
         * Do NOT touch isAuthenticated here.
         */
        state.initializing = true;
      })

      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.initializing = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(loadUserThunk.rejected, (state) => {
        state.initializing = false;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  loginSuccess,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;