import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

// Optional: If you're using TypeScript, you can keep these types for better type safety.
// For plain JavaScript, these are not necessary but can be useful for documentation.
export const getRootState = store.getState;
export const appDispatch = store.dispatch;