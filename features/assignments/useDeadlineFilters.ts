"use client";

import { useMemo, useState } from "react";
import type { Assignment, DeadlineFilter } from "./types";

const todayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export function getDayDistance(dueDate: string): number {
  const due = new Date(`${dueDate}T00:00:00`);
  return Math.ceil((due.getTime() - todayStart().getTime()) / 86_400_000);
}

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
