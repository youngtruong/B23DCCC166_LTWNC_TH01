"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { store } from "./store";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Provider store={store}><ThemeProvider>{children}</ThemeProvider></Provider>;
}
