import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { Navigate } from "react-router";

export const authBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: authBaseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { username, password },
      }),
      onSuccess: ({data}) => {
        localStorage.setItem("token", data.token); // or data.access_token
        localStorage.setItem("user", JSON.stringify(data.user));
      },
    }),
    signup: builder.mutation({
      query: ({ username,email,password }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { username,email,password },
      }),
    }),
    
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;