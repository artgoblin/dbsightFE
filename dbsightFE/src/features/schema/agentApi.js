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

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery,
  tagTypes: ["AgentApi"],
  endpoints: (builder) => ({
    fetchQueryResponse: builder.mutation({
      query: ({ prompt, dbName }) => ({
        url: `/ask/query`,
        method: "POST",
        body: { text: prompt, database_name: dbName },
      }),
      invalidatesTags: ["AgentApi"],
    }),
  }),
});

export const { useFetchQueryResponseMutation } = agentApi;
