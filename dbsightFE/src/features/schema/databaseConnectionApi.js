import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "./baseQuery";

export const databaseConnectionApi = createApi({
  reducerPath: "databaseConnectionApi",
  baseQuery: authBaseQuery,
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
