import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import assignmentsReducer from "@/features/assignments/assignmentsSlice";

export const store = configureStore({
  middleware: getDefaultMiddleware => process.env.NODE_ENV === "development" ? getDefaultMiddleware().concat(createLogger({ collapsed: true, predicate: (_getState, action) => action.type !== "assignments/replaceAssignments" })) : getDefaultMiddleware(),
  reducer: {
    assignments: assignmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
