import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCategories,
    createWord,
    addWord,
    editWord,
    fetchAllWords,
    ownWord,
    deleteWord,
    getStatistics,
    getTasks,
    addAnswers,
} from "./operations";

const handlePending = (state) => {
    state.isLoading = true;
    state.error = null;
};

const handleRejected = (state, action) => {
    state.isLoading = false;
    state.error = action.payload || action.error?.message;
};

const initialState = {
    words: [],
    ownWords: [],
    categories: [],
    result: [],
    tasks: [],
    statistics: null,
    page: null,
    totalPages: null,
    perPage: null,
    isLoading: false,
    error: null,
};

const wordSlice = createSlice({
    name: "words",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, handlePending)
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, handleRejected)
        
            .addCase(createWord.pending, handlePending)
            .addCase(createWord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ownWords = [action.payload, ...state.ownWords];
            })
            .addCase(createWord.rejected, handleRejected)
        
            .addCase(addWord.pending, handlePending)
            .addCase(addWord.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addWord.rejected, handleRejected)
        
            .addCase(editWord.pending, handlePending)
            .addCase(editWord.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.ownWords.findIndex(
                    (word) => word._id === action.payload._id
                );
                if (index !== -1) {
                    state.ownWords[index] = action.payload;
                }
            })
            .addCase(editWord.rejected, handleRejected)
        
            .addCase(fetchAllWords.pending, handlePending)
            .addCase(fetchAllWords.fulfilled, (state, action) => {
                state.isLoading = false;
                state.words = action.payload.results;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.perPage = action.payload.perPage;
            })
            .addCase(fetchAllWords.rejected, handleRejected)
        
            .addCase(ownWord.pending, handlePending)
            .addCase(ownWord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ownWords = action.payload.results;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.perPage = action.payload.perPage;
            })
            .addCase(ownWord.rejected, handleRejected)
        
            .addCase(deleteWord.pending, handlePending)
            .addCase(deleteWord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ownWords = state.ownWords.filter(
                    (word) => word._id !== action.payload.id
                );
            })
            .addCase(deleteWord.rejected, handleRejected)
        
            .addCase(getStatistics.pending, handlePending)
            .addCase(getStatistics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.statistics = action.payload;
            })
            .addCase(getStatistics.rejected, handleRejected)
        
            .addCase(getTasks.pending, handlePending)
            .addCase(getTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, handleRejected)
        
            .addCase(addAnswers.pending, handlePending)
            .addCase(addAnswers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.result = [...action.payload, ...state.result];
            })
            .addCase(addAnswers.rejected, handleRejected)
    },
});

export default wordSlice.reducer;