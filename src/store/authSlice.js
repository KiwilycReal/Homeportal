import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    /**
     *   This check is only triggered when the entire web initialized
     * for the first time. And the user is only considered as logged in
     * when the there is a username stored in the localStorage and no more
     * than 30 minutes has passed since the last login operation.
     */
    isLogged: localStorage.getItem('username') !== '' && (new Date() - localStorage.getItem('loginTimestamp') <= 1800000),
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
