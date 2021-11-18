import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isActive: false,
    title: '',
    message: '',
    alertSeverity: 'error',
    autoHideDuration: 6000,
    vertical: 'top',
    horizontal: 'center',

};

const snackbarSlice =  createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        showMessage(state, action){
            state = {
                ...state,
                isActive: true,
                ...(action.payload)
            }
        },
        close(state){
            state.isActive = false;
        }
    } 
});

export const snackbarReducer =  snackbarSlice.reducer;
export const snackbarActions = snackbarSlice.actions;
