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

export const databaseConnectionApi = createApi({
  reducerPath: "databaseConnectionApi",
  baseQuery,
  tagTypes: ["Schema", "DatabaseConnection"],
  endpoints: (builder) => ({
    getDatabaseConnection: builder.query({
      query: () => `/ask/getallconnections`,
      providesTags: ["DatabaseConnection"],
    }),

    getSchemaDetails: builder.query({
      query: (dbName) => `/ask/getschemadetails/${dbName}`,
      providesTags: ["Schema", "DatabaseConnection"],
    }),

    reconnectDatabase: builder.mutation({
      query: (dbName) => `/ask/reconnect/${dbName}`,
      invalidatesTags: ["DatabaseConnection", "Schema"],
    }),

    createDatabaseConnection: builder.mutation({
      query: (connectionDetails) => ({
        url: `/ask/newdbconnection`,
        method: "POST",
        body: connectionDetails,
      }),
      invalidatesTags: ["DatabaseConnection", "Schema"],
    }),

    deleteDatabaseConnection: builder.mutation({
      query: (connectionName) => ({
        url: `/ask/deleteconnection/${connectionName}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DatabaseConnection", "Schema"],
    }),
  }),
});

export const {
  useGetDatabaseConnectionQuery,
  useLazyGetDatabaseConnectionQuery,
  useGetSchemaDetailsQuery,
  useReconnectDatabaseMutation,
  useCreateDatabaseConnectionMutation,
  useDeleteDatabaseConnectionMutation,
} = databaseConnectionApi;
