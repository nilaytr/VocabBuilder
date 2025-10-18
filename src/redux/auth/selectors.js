export const selectUser = (state) => state.users.user;
export const selectIsLoggedIn = (state) => state.users.isLoggedIn;
export const selectIsRefreshing = (state) => state.users.isRefreshing;
export const selectToken = (state) => state.users.token;
export const selectError = (state) => state.users.error;
export const selectIsLoading = (state) => state.users.isLoading;