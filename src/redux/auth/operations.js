import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/api/";

const setAuthHeader = (token) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
    axios.defaults.headers.common.Authorization = "";
};

const handleError = (error, rejectWithValue) => {
    let message = error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.";

    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = "Bad request. Please check your input.";
                break;
            case 404:
                message = "Service not found.";
                break;
            case 401:
                message = "Email or password invalid";
                break;
            case 409:
                message = "User with this email already exists.";
                break;
            case 500:
                message = "Server error. Something went wrong on our end. Please try again later.";
                break;
            default:
                message = error.response.data?.message || message;
        }
    }
    toast.error(message);
    return rejectWithValue(message);
};

export const registerUser = createAsyncThunk(
    "users/signup",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post("users/signup", {
                name,
                email,
                password,
            });
            
            setAuthHeader(response.data.token);
            
            toast.success("Registration successful!");
            return response.data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const loginUser = createAsyncThunk(
    "users/signin",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post("users/signin", { email, password });
            
            setAuthHeader(response.data.token);

            toast.success("Login successful!");
            return response.data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "users/logout",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const token = state.users.token;
            
            if (!token) {
                return rejectWithValue("No token found for logout.");
            }
            
            setAuthHeader(token);
            
            await axios.post("users/signout");
            clearAuthHeader();
            
            toast.success("Logged out successfully!");
            return { message: "User signed out successfully" };
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    "users/current",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const token = state.users.token;
            
            if (!token) {
                return rejectWithValue("No token found.");
            }
            
            setAuthHeader(token);

            const response = await axios.get("users/current");
            return response.data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const refreshUser = createAsyncThunk(
    "users/refresh",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        const persistedToken = state.users.token;
        
        if (persistedToken === null) {
            return thunkAPI.rejectWithValue("Unable to fetch user");
        }
        
        try {
            setAuthHeader(persistedToken);

            const response = await axios.get("users/current");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);