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

export const schemaApi = createApi({
  reducerPath: 'schemaApi',
  baseQuery,
  tagTypes: ['Schema'],
  endpoints: (builder) => ({
    getSchemaDetails: builder.query({
      query: (dbName) => `/ask/getschemadetails/${dbName}`,
      providesTags: ['Schema'],
    }),
    
    // Optional: Login endpoint to get token
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login', // adjust to your auth endpoint
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Assume response: { token: "eyJhbGciOiJIUzI1NiJ9..." }
          if (data?.token) {
            setToken(data.token);
          }
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),
  }),
});

export const { useGetSchemaDetailsQuery, useLoginMutation } = schemaApi;