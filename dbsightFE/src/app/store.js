import { configureStore } from "@reduxjs/toolkit";
import { databaseConnectionApi } from "../features/schema/databaseConnectionApi";
import { queryExecutionApi } from "../features/schema/queryExecutionApi";
import { agentApi } from "../features/schema/agentApi";

export const store = configureStore({
  reducer: {
    [databaseConnectionApi.reducerPath]: databaseConnectionApi.reducer,
    [queryExecutionApi.reducerPath]: queryExecutionApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      databaseConnectionApi.middleware,
      queryExecutionApi.middleware,
      agentApi.middleware,
    ),
});
