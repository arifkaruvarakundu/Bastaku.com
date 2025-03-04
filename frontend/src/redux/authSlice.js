// src/redux/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload ? true : false;
      
    },
    setNotAuthenticated: (state) => {
      state.isAuthenticated = false;
      
    },
  },
});

export const { setAuthenticated, setNotAuthenticated } = authSlice.actions;

export default authSlice.reducer;