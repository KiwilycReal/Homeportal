import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: localStorage.getItem('username') !== '',
};

const authSlice =  createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state){
            state.isLogged = true
        },
        logout(state){
            state.isLogged = false
        }
    } 
});

export const authReducer =  authSlice.reducer;
export const authActions = authSlice.actions
