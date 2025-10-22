import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { auth, db } from "../../firebase";
import { doc, setDoc, addDoc, updateDoc, collection } from "firebase/firestore";

axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/api/";

const handleAxiosError = (error, rejectWithValue) => {
    if (error.response) {
        return rejectWithValue({
            status: error.response.status,
            message: error.response.data?.message || error.response.statusText
        });
    } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
    } else {
        return rejectWithValue({ message: error.message });
    }
};

export const fetchCategories = createAsyncThunk(
    "words/categories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("words/categories");
            return response.data;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const createWord = createAsyncThunk(
    "words/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post("words/create", data);
            const createdWord = response.data;

            await addDoc(collection(db, "words"), {
                ...data,
                backendId: createdWord.id || null,
                createdAt: new Date().toISOString(),
            });
            return createdWord;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const addWord = createAsyncThunk(
    "words/add",
    async (wordId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`words/add/${wordId}`);
            const addedWord = response.data;

            const user = auth.current;
            if (user) {
                const wordRef = doc(db, "users", user.uid, "words", addedWord._id);

                await setDoc(wordRef, {
                    en: addedWord.en,
                    ua: addedWord.ua,
                    category: addedWord.category,
                    isIrregular: addedWord.isIrregular,
                    owner: addedWord.owner,
                    progress: addedWord.progress ?? 0,
                    createdAt: new Date().toISOString(),
                });
            } else {
                return rejectWithValue({ message: "User not authenticated" });
            }

            return addedWord;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const editWord = createAsyncThunk(
    "words/edit",
    async ({ wordId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`words/edit/${wordId}`, updatedData);
            const editedWord = response.data;

            const user = auth.currentUser;
            if (user) {
                const wordRef = doc(db, "users", user.uid, "words", editedWord._id);

                await updateDoc(wordRef, {
                    en: editedWord.en,
                    ua: editedWord.ua,
                    category: editedWord.category,
                    isIrregular: editedWord.isIrregular,
                    progress: editedWord.progress ?? 0,
                    updatedAt: new Date().toISOString(),
                });
            } else {
                return rejectWithValue({ message: "User not authenticated" });
            }

            return editedWord;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);