// src/features/schema/schemaApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../component/ui/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080", // or '/' if using proxy
  prepareHeaders: (headers, { getState }) => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc3NzEzOTExOSwiZXhwIjoxNzc3MjI1NTE5fQ.omw8OI9uuRYYGoVJNHdO5kw4xK0r-s0jZ71k8_Ceuc4";
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
        url: `/ask/savedquery`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QueryExecution"],
    }),
    updateQuery: builder.mutation({
      query: ({id,data}) => ({
        url: `/ask/savedquery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["QueryExecution"],
    }),
    deleteSavedQuery: builder.mutation({
      query: (id) => ({
        url: `/ask/savedquery/${id}`,
        method: "DELETE",
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
  useDeleteSavedQueryMutation,
  useUpdateQueryMutation,
} = queryExecutionApi;
