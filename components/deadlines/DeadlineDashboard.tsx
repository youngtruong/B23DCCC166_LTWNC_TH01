"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import type { DeadlineFilter } from "@/features/assignments/types";
import { getDayDistance, useDeadlineFilters } from "@/features/assignments/useDeadlineFilters";
import { useDeadlineTools } from "@/features/assignments/useDeadlineTools";
import { FilterTabs } from "./FilterTabs";
import { AssignmentForm } from "@/features/assignments/AssignmentForm";
import { AssignmentList } from "@/features/assignments/AssignmentList";
import { generateAssignments } from "@/features/assignments/utils";
import { replaceAssignments } from "@/features/assignments/assignmentsSlice";
import { ThemeToggle } from "@/features/theme/ThemeContext";
const Statistics = lazy(() => import("@/features/assignments/Statistics"));

const filterLabels: Record<DeadlineFilter, string> = { all: "Tất cả", pending: "Chưa hoàn thành", overdue: "Quá hạn", completed: "Đã hoàn thành" };

export function DeadlineDashboard() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.assignments);
  const [search, setSearch] = useState("");
  const [showStats, setShowStats] = useState(false);
  const { filter, setFilter, counts } = useDeadlineFilters(items);
  const upcoming = useMemo(() => items.filter((item) => !item.completed && getDayDistance(item.dueDate) >= 0).length, [items]);
  useDeadlineTools();



  return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="#main-list" aria-label="Về danh sách deadline"><span className="brand-mark"><CalendarDays aria-hidden="true" /></span><span><strong>Deadline</strong><small>Student tracker</small></span></a><ThemeToggle /><div className="semester-chip"><span /> Học kỳ I · 2026</div></header>
      <div className="dashboard-grid">
        <aside><AssignmentForm /></aside>
        <section className="content-column" id="main-list">
          <div className="welcome-row"><div><p className="date-label">Kế hoạch học tập</p><h1>Deadline của bạn</h1><p>{upcoming > 0 ? `Bạn có ${upcoming} bài tập đang chờ xử lý.` : "Bạn đã xử lý hết các deadline hiện tại."}</p></div><div className="progress-orbit" aria-label={`${counts.completed} trên ${counts.all} bài đã hoàn thành`}><strong>{counts.all ? Math.round((counts.completed / counts.all) * 100) : 0}%</strong><span>hoàn thành</span></div></div>
          <FilterTabs value={filter} onValueChange={setFilter}><FilterTabs.List>{(Object.keys(filterLabels) as DeadlineFilter[]).map((value) => <FilterTabs.Tab key={value} value={value} count={counts[value]}>{filterLabels[value]}</FilterTabs.Tab>)}</FilterTabs.List></FilterTabs>
          <div className="list-toolbar"><input aria-label="Tìm kiếm bài tập" placeholder="Tìm kiếm bài tập…" value={search} onChange={e => setSearch(e.target.value)} /><Button onClick={() => dispatch(replaceAssignments(generateAssignments()))}>Tạo 10.000 bài tập mẫu</Button><Button onClick={() => setShowStats(value => !value)}>Thống kê</Button></div>
          {showStats ? <Suspense fallback={<p>Đang tải thống kê…</p>}><Statistics items={items} /></Suspense> : <AssignmentList search={search} filter={filter} />}
          <footer className="list-footer"><span>Dữ liệu mẫu được tải từ API giả lập</span><ChevronRight aria-hidden="true" /></footer>
        </section>
      </div>
    </main>
  );
}
