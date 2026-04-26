// src/features/schema/schemaApi.js
import { createApi} from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "./baseQuery";

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: authBaseQuery,
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
