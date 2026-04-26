import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "./baseQuery";


export const queryExecutionApi = createApi({
  reducerPath: "queryExecutionApi",
  baseQuery: authBaseQuery,
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
