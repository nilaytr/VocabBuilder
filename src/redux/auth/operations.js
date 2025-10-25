import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp, increment } from "firebase/firestore";

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
            console.error("Login error:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "users/signout",
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;

            await axios.post("users/signout");
            await signOut(auth);

            clearAuthHeader();

            if (user) {
                await addDoc(collection(db, `users/${user.uid}/activity`), {
                    type: "logout",
                    timestamp: serverTimestamp(),
                });
            }
            
            return { message: "User signed out successfully" };
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