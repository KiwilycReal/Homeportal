import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { snackbarReducer } from "./snackbarSlice";

const store = configureStore({
    reducer:{
        auth: authReducer,
        snackbar: snackbarReducer
    }
});

export default store;