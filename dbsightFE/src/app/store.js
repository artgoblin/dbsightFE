import { configureStore } from '@reduxjs/toolkit';
import { databaseConnectionApi } from '../features/schema/databaseConnectionApi';

export const store = configureStore({
  reducer: {
    [databaseConnectionApi.reducerPath]: databaseConnectionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(databaseConnectionApi.middleware),
});