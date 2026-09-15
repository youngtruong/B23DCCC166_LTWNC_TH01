"use client";

import { createContext, useContext, type ButtonHTMLAttributes, type PropsWithChildren } from "react";
import type { DeadlineFilter } from "@/features/assignments/types";

interface FilterTabsContextValue {
  value: DeadlineFilter;
  onValueChange: (value: DeadlineFilter) => void;
}

const FilterTabsContext = createContext<FilterTabsContextValue | null>(null);

function useFilterTabs() {
  const context = useContext(FilterTabsContext);
  if (!context) throw new Error("FilterTabs components must be used inside FilterTabs.");
  return context;
}

function FilterTabsRoot({ value, onValueChange, children }: PropsWithChildren<FilterTabsContextValue>) {
  return (
    <FilterTabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </FilterTabsContext.Provider>
  );
}

function FilterTabsList({ children }: PropsWithChildren) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Lọc bài tập theo trạng thái">
      {children}
    </div>
  );
}

interface FilterTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: DeadlineFilter;
  count: number;
}

function FilterTabsTab({ value, count, children, ...props }: FilterTabProps) {
  const context = useFilterTabs();
  const active = context.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className="filter-tab"
      data-active={active}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      <span>{children}</span>
      <span className="filter-count">{count}</span>
    </button>
  );
}

export const FilterTabs = Object.assign(FilterTabsRoot, {
  List: FilterTabsList,
  Tab: FilterTabsTab,
});
