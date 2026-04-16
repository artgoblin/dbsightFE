// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { schemaApi } from '../features/schema/schemaApi';
import { databaseConnectionApi } from '../features/schema/databaseConnectionApi';

export const store = configureStore({
  reducer: {
    // Add RTK Query reducer
    [schemaApi.reducerPath]: schemaApi.reducer,
    [databaseConnectionApi.reducerPath]: databaseConnectionApi.reducer,
    // Add other slice reducers here as needed
    // exampleSlice: exampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(schemaApi.middleware, databaseConnectionApi.middleware),
});