import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoggedIn: false,
    defaultProject: null,
  },

  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    update: (state, action) => {
      const prevUser = state.user;
      state.user = { ...prevUser, ...action.payload };
    },
    logout: (state) => {
      state = null;
    },
    updateDefaultProject: (state, action) => {
      state.defaultProject = action.payload;
    },
  },
});

export const { loginUser, update, logout, updateDefaultProject } =
  userSlice.actions;
export default userSlice.reducer;
