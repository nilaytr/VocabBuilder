import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, logoutUser, refreshUser } from "./operations";

const handlePending = (state) => {
    state.isLoading = true;
    state.error = null;
};

const handleRejected = (state, action) => {
    state.isLoading = false;
    state.isRefreshing = false;
    state.error = action.payload || action.error?.message;
};

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isLoggedIn: false,
    isRefreshing: false,
};

export const authSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, handlePending)
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = {
                    name: action.payload.name,
                    email: action.payload.email,
                };
                state.token = action.payload.token || null;
                state.isLoggedIn = true;
            })
            .addCase(registerUser.rejected, handleRejected)
        
            .addCase(loginUser.pending, handlePending)
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = {
                    name: action.payload.name,
                    email: action.payload.email,
                };
                state.token = action.payload.token || null;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, handleRejected)
        
            .addCase(logoutUser.pending, handlePending)
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isLoggedIn = false;
            })
            .addCase(logoutUser.rejected, handleRejected)
        
            .addCase(refreshUser.pending, (state) => {
                state.isRefreshing = true;
                state.error = null;
            })
            .addCase(refreshUser.fulfilled, (state, action) => {
                state.isRefreshing = false;
                state.user = {
                    name: action.payload.name,
                    email: action.payload.email,
                };
                state.isLoggedIn = true;
            })
            .addCase(refreshUser.rejected, handleRejected);
    },
});

export default authSlice.reducer;