import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp, increment } from "firebase/firestore";
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
                message = "Such email already exists";
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
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = response.user;
            await updateProfile(user, { displayName: name });

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                name,
                email,
                emailVerified: user.emailVerified,
                provider: user.providerData[0]?.providerId || "password",
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                loginCount: 1,
            });
            
            await addDoc(collection(db, `users/${user.uid}/activity`), {
                type: "signup",
                timestamp: serverTimestamp(),
            });

            const token = await user.getIdToken();
            setAuthHeader(token);

            const apiResponse = await axios.post("users/signup", {
                name,
                email,
                password,
            });

            return { ...apiResponse.data, token };
        } catch (error) {
            return handleError(error, rejectWithValue);
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

            const userRef = doc(db, "users", user.uid);
            try {
                await setDoc(
                    userRef,
                    {
                        lastLogin: serverTimestamp(),
                        loginCount: increment(1),
                    },
                    { merge: true }
                );
                console.log("Firestore user updated or created!");
            } catch (firestoreError) {
                console.error("Firestore login update error:", firestoreError);
            }

            await addDoc(collection(db, `users/${user.uid}/activity`), {
                type: "login",
                timestamp: serverTimestamp(),
            });

            const apiResponse = await axios.post("users/signin", {
                email,
                password,
            });

            console.log("Login successful:", apiResponse.data);
            return { ...apiResponse.data, token };
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const logoutUser = createAsyncThunk(
  "users/signout",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const persistedToken = state.auth.token;

      if (!persistedToken) {
        return rejectWithValue("No token found for logout");
      }

      axios.defaults.headers.common.Authorization = `Bearer ${persistedToken}`;

      await axios.post("/users/signout");

        clearAuthHeader();

      return { message: "User signed out successfully" };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
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
            return handleError(error, rejectWithValue);
        }
    }
);

export const refreshUser = createAsyncThunk(
    "users/refresh",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        const persistedToken = state.users.token;
        
        if (!persistedToken) {
            return thunkAPI.rejectWithValue("No token found");
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