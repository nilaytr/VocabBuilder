import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";

axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/api/";

const setAuthHeader = (token) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
    axios.defaults.headers.common.Authorization = "";
};

export const registerUser = createAsyncThunk(
    "users/signup",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = response.user;
            await updateProfile(user, { displayName: name });
            
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name,
                    email,
                    createdAt: new Date(),
                });
                console.log("Firestore user added!");
            } catch (err) {
                console.error("Firestore error:", err);
            }

            const token = await user.getIdToken();
            setAuthHeader(token);

            const apiResponse = await axios.post("users/signup", {
                name,
                email,
                password,
            });

            return apiResponse.data;
        } catch (error) {
            console.error("Registration error:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "users/signin",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = response.user;

            const token = await user.getIdToken();
            setAuthHeader(token);

            const apiResponse = await axios.post("users/signin", {
                email,
                password,
            });

            return apiResponse.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "users/signout",
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            await axios.post("users/signout");

            clearAuthHeader();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    "users/current",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("users/current");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const refreshUser = createAsyncThunk(
    "users/refresh",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        const persistedToken = state.users.token;

        if (!persistedToken) {
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