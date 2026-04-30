import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { Navigate } from "react-router";

export const authBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithLogout = async (args, api, extraOptions) => {
  let result = await authBaseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { username, password },
      }),
      onSuccess: ({ data }) => {
        // Ensure we use 'authToken' consistently
        localStorage.setItem("authToken", data.token || data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      },
    }),
    signup: builder.mutation({
      query: ({ username, email, password }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { username, email, password },
      }),
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
} = authApi;
