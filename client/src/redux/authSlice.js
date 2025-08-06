import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/register', data);
    localStorage.setItem('token', res.data.token);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
