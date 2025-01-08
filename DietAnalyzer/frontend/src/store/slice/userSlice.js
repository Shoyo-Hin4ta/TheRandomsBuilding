import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null  // Add this
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.user;
      state.accessToken = action.payload.accessToken;  // Store token
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.accessToken = null;  // Clear token
      state.isAuthenticated = false;
      state.error = null;
    }
  }
});

// Action creators
export const { 
  setUser, 
  setLoading, 
  setError, 
  clearUser 
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;