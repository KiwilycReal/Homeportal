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
            // Need to find a better way, the state here is a proxy instead of ordinary object
            if(action.payload.message) state.message = action.payload.message
            if(action.payload.title) state.title = action.payload.title
            if(action.payload.alertSeverity) state.alertSeverity = action.payload.alertSeverity
            if(action.payload.autoHideDuration) state.autoHideDuration = action.payload.autoHideDuration
            if(action.payload.vertical) state.vertical = action.payload.vertical
            if(action.payload.horizontal) state.horizontal = action.payload.horizontal
            state.isActive = true
        },
        close(state){
            state.isActive = false;
        }
    } 
});

export const snackbarReducer =  snackbarSlice.reducer;
export const snackbarActions = snackbarSlice.actions;
