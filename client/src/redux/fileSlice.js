import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  files: [],
  loading: false,
  error: null,
};

export const fetchFiles = createAsyncThunk('files/fetchFiles', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/upload/files');
    return res.files;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Failed to fetch files');
  }
});

export const uploadFile = createAsyncThunk('files/uploadFile', async (file, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    // Do NOT set Content-Type header here!
    const res = await api.post('/api/upload', formData, { headers: {} });
    return res.file;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'File upload failed');
  }
});

export const deleteFile = createAsyncThunk('files/deleteFile', async (fileId, thunkAPI) => {
  try {
    await api.delete(`/api/upload/${fileId}`);
    return fileId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'File delete failed');
  }
});

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.unshift(action.payload);
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(f => f._id !== action.payload);
      });
  },
});

export default fileSlice.reducer;
