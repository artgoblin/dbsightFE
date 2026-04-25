// src/features/schema/schemaApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../component/ui/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080", // or '/' if using proxy
  prepareHeaders: (headers, { getState }) => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc3NzA1Nzk4OCwiZXhwIjoxNzc3MTQ0Mzg4fQ.7VXCme1R8TJIGr6Mg1Rk8-zBZMi4cFL1G2o9Fql045U";
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Optional: Add other headers
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const queryExecutionApi = createApi({
  reducerPath: "queryExecutionApi",
  baseQuery,
  tagTypes: ["QueryExecution"],
  endpoints: (builder) => ({
    getAllQueryCache: builder.query({
      query: () => `/ask/getallquerycache`,
      providesTags: ["QueryExecution"],
    }),
    saveQuery: builder.mutation({
      query: (data) => ({
        url: `/ask/savequery`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QueryExecution"],
    }),
    getAllSavedQuery: builder.query({
      query: () => `/ask/getallsavedqueries`,
      providesTags: ["QueryExecution"],
    }),

    executeSql: builder.mutation({
      query: ({ body, offset = 0, limit = 10 }) => ({
        url: `/ask/executesql?offset=${offset}&limit=${limit}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["QueryExecution"],
    }),
    
  }),
});

export const {
  useGetAllQueryCacheQuery,
  useSaveQueryMutation,
  useGetAllSavedQueryQuery,
  useExecuteSqlMutation,
} = queryExecutionApi;
