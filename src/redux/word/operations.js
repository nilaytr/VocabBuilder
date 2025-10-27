import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/api/";

const setAuthHeader = (token) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
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

export const fetchCategories = createAsyncThunk(
    "words/categories",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.get("words/categories");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const createWord = createAsyncThunk(
    "words/create",
    async (wordData, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.post("words/create", wordData);
            toast.success("Word created successfully!");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const addWord = createAsyncThunk(
    "words/add",
    async (wordId, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.post(`words/add/${wordId}`);
            toast.success("Word added successfully!");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const editWord = createAsyncThunk(
    "words/edit",
    async ({ wordId, updatedData }, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.patch(`words/edit/${wordId}`, updatedData);
            toast.success("Word updated successfully!");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
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
    } = {}, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const params = new URLSearchParams();
            if (search.trim()) params.append("keyword", search.trim());
            if (category && category !== "all") params.append("category", category);
            if (category === "verb" && typeof verbType !== "undefined");
            
            params.append("isIrregular", String(verbType));
            params.append("page", String(page));
            params.append("limit", String(limit));
            
            const { data } = await axios.get(`words/all?${params.toString()}`);
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
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
    } = {}, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            const params = new URLSearchParams();

            if (search.trim()) params.append("keyword", search.trim());
            if (category && category !== "all") params.append("category", category);
            if (category === "verb" && typeof verbType !== "undefined");
                
            params.append("isIrregular", String(verbType));
            params.append("page", String(page));
            params.append("limit", String(limit));
            
            const { data } = await axios.get(`words/own?${params.toString()}`);
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const deleteWord = createAsyncThunk(
    "words/delete",
    async (wordId, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.delete(`words/delete/${wordId}`);
            toast.success("Word deleted successfully!");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const getStatistics = createAsyncThunk(
    "words/statistics",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.get("words/statistics");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const getTasks = createAsyncThunk(
    "words/tasks",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.get("words/tasks");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

export const addAnswers = createAsyncThunk(
    "words/answers",
    async (answers = [], { rejectWithValue, getState }) => {
        try {
            const token = getState().users.token;
            if (token) setAuthHeader(token);
            
            const { data } = await axios.post("words/answers", answers);
            toast.success("Training results submitted!");
            return data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);