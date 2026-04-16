// src/features/schema/schemaApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../component/ui/auth';


const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080', // or '/' if using proxy
  prepareHeaders: (headers, { getState }) => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc3NjM0ODkzNywiZXhwIjoxNzc2NDM1MzM3fQ.r1u2Kqd8bH02GSoB8fYhjeqH0iPpCTFF9CDdRWSzyCM";
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Optional: Add other headers
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const databaseConnectionApi = createApi({
  reducerPath: 'databaseConnectionApi',
  baseQuery,
  tagTypes: ['Schema'],
  endpoints: (builder) => ({
    getDatabaseConnection: builder.query({
      query: () => `/ask/getallconnections`,
      providesTags: ['Schema'],
    }),

    reconnectDatabase: builder.mutation({
      query: (dbName) => `/ask/reconnect/${dbName}`,
      invalidatesTags: ['Schema'],
    }),
  }),
});

export const { useGetDatabaseConnectionQuery, useLazyGetDatabaseConnectionQuery, useReconnectDatabaseMutation } = databaseConnectionApi;