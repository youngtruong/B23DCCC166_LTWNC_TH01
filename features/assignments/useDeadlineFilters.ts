"use client";

import { useMemo, useState } from "react";
import type { Assignment, DeadlineFilter } from "./types";

import { calcDaysLeft } from "./utils";
export const getDayDistance = calcDaysLeft;

export function useDeadlineFilters<T extends Assignment>(items: readonly T[]) {
  const [filter, setFilter] = useState<DeadlineFilter>("all");

  const filteredItems = useMemo(() => {
    return [...items]
      .filter((item) => {
        if (filter === "pending") return !item.completed && getDayDistance(item.dueDate) >= 0;
        if (filter === "overdue") return !item.completed && getDayDistance(item.dueDate) < 0;
        if (filter === "completed") return item.completed;
        return true;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [filter, items]);

  const counts = useMemo<Record<DeadlineFilter, number>>(
    () => ({
      all: items.length,
      pending: items.filter((item) => !item.completed && getDayDistance(item.dueDate) >= 0).length,
      overdue: items.filter((item) => !item.completed && getDayDistance(item.dueDate) < 0).length,
      completed: items.filter((item) => item.completed).length,
    }),
    [items],
  );

  return { filter, setFilter, filteredItems, counts };
}
