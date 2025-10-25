import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { auth, db } from "../../firebase";
import { doc, setDoc, addDoc, updateDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";

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

            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue({ message: "User not authenticated" });
            }

            const wordRef = doc(db, "users", user.uid, "words", createdWord._id);

            await setDoc(wordRef, {
                ...data,
                backendId: createdWord._id,
                progress: 0,
                createdAt: serverTimestamp(),
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

            const user = auth.currentUser;
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
                    updatedAt: serverTimestamp(),
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

export const fetchAllWords = createAsyncThunk(
    "words/all",
    async ({
        search = "",
        category = "all",
        verbType,
        page = 1,
        limit = 7
    } = {}, { rejectWithValue }) => {
        try {
            const cleanSearch = search.trim();

            const params = new URLSearchParams();
            if (cleanSearch) params.append("keyword", cleanSearch);
            if (page) params.append("page", String(page));
            if (limit) params.append("limit", String(limit));

            if (category && category !== "all") {
                params.append("category", category);
                if (category === "verb" && typeof verbType !== "undefined") {
                    params.append("isIrregular", String(verbType));
                }
            }

            const url = `words/all?${params.toString()}`;

            const response = await axios.get(url);
            const data = response.data;

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, `users/${user.uid}/searchHistory`), {
                    keyword: cleanSearch || "(empty)",
                    category,
                    verbType: typeof verbType !== "undefined" ? verbType : null,
                    page,
                    resultCount: data.results?.length || 0,
                    createdAt: serverTimestamp(),
                });
            }
            return data;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const ownWord = createAsyncThunk(
    "words/own",
    async ({
        search = "",
        category = "all",
        verbType,
        page = 1,
        limit = 7
    } = {}, { rejectWithValue }) => {
        try {
            const cleanSearch = search.trim();

            const params = new URLSearchParams();
            if (cleanSearch) params.append("keyword", cleanSearch);
            if (page) params.append("page", String(page));
            if (limit) params.append("limit", String(limit));

            if (category && category !== "all") {
                params.append("category", category);
                if (category === "verb" && typeof verbType !== "undefined") {
                    params.append("isIrregular", String(verbType));
                }
            }

            const url = `words/own?${params.toString()}`;

            const response = await axios.get(url);
            const data = response.data;

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, `users/${user.uid}/ownWordsQueries`), {
                    keyword: cleanSearch || "(empty)",
                    category,
                    verbType: typeof verbType !== "undefined" ? verbType : null,
                    page,
                    resultCount: data.results?.length || 0,
                    createdAt: serverTimestamp(),
                });
            }
            return data;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const deleteWord = createAsyncThunk(
    "words/delete",
    async (wordId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`words/delete/${wordId}`);
            const { id, message } = response.data;

            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue({ message: "User not authenticated" });
            }

            const wordRef = doc(db, "users", user.uid, "words", id);
            await deleteDoc(wordRef);

            return { id, message };
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const getStatistics = createAsyncThunk(
    "words/statistics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("words/statistics");
            const { totalCount } = response.data;

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, `users/${user.uid}/statisticsHistory`), {
                    totalCount,
                    createdAt: serverTimestamp(),
                });
            }
            return { totalCount };
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const getTasks = createAsyncThunk(
    "words/tasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("words/tasks");
            const data = response.data;
            
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, `users/${user.uid}/tasksHistory`), {
                    taskCount: data.words?.length || 0,
                    preview: data.words?.slice(0, 3) || [],
                    createdAt: serverTimestamp(),
                });
            }
            return data;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);

export const addAnswers = createAsyncThunk(
    "words/answers",
    async (answers = [], { rejectWithValue }) => {
        try {
            const response = await axios.post("words/answers", answers);
            const result = response.data;

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, `users/${user.uid}/answersHistory`), {
                    answers: result,
                    totalAnswered: result.length,
                    correctCount: result.filter(a => a.isDone).length,
                    createdAt: serverTimestamp(),
                });
            }
            return result;
        } catch (error) {
            return handleAxiosError(error, rejectWithValue);
        }
    }
);