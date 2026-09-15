"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, BookOpen, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { addAssignment, deleteAssignment, fetchAssignments, toggleAssignment } from "@/features/assignments/assignmentsSlice";
import type { CreateAssignmentInput, DeadlineFilter, Priority } from "@/features/assignments/types";
import { getDayDistance, useDeadlineFilters } from "@/features/assignments/useDeadlineFilters";
import { useDeadlineTools } from "@/features/assignments/useDeadlineTools";
import { FilterTabs } from "./FilterTabs";

const priorityMeta: Record<Priority, { label: string; className: string }> = {
  high: { label: "Cao", className: "priority-high" },
  medium: { label: "Trung bình", className: "priority-medium" },
  low: { label: "Thấp", className: "priority-low" },
};

const filterLabels: Record<DeadlineFilter, string> = {
  all: "Tất cả",
  pending: "Chưa hoàn thành",
  overdue: "Quá hạn",
  completed: "Đã hoàn thành",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function relativeDeadline(date: string) {
  const days = getDayDistance(date);
  return days < 0 ? `Quá hạn ${Math.abs(days)} ngày` : `Còn ${days} ngày`;
}

function AssignmentForm() {
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [errors, setErrors] = useState<Partial<Record<keyof CreateAssignmentInput, string>>>({});

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!subject.trim()) nextErrors.subject = "Vui lòng nhập môn học.";
    if (!title.trim()) nextErrors.title = "Vui lòng nhập tên bài tập.";
    if (!dueDate) nextErrors.dueDate = "Vui lòng chọn hạn nộp.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    dispatch(addAssignment({ subject: subject.trim(), title: title.trim(), dueDate, priority }));
    setSubject(""); setTitle(""); setDueDate(""); setPriority("medium");
    toast.success("Đã thêm bài tập mới");
  };

  return (
    <section className="create-panel" aria-labelledby="create-heading">
      <div className="panel-heading"><span className="heading-icon"><Plus aria-hidden="true" /></span><div><p className="eyebrow">Thêm nhanh</p><h2 id="create-heading">Bài tập mới</h2></div></div>
      <form className="deadline-form" onSubmit={submit} noValidate>
        <label><span>Môn học</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ví dụ: Lập trình Web nâng cao" aria-invalid={!!errors.subject} />{errors.subject && <small>{errors.subject}</small>}</label>
        <label><span>Tên bài tập</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Bạn cần hoàn thành gì?" aria-invalid={!!errors.title} />{errors.title && <small>{errors.title}</small>}</label>
        <div className="form-row">
          <label><span>Hạn nộp</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} aria-invalid={!!errors.dueDate} />{errors.dueDate && <small>{errors.dueDate}</small>}</label>
          <label><span>Độ ưu tiên</span><Select value={priority} onValueChange={(value) => setPriority(value as Priority)}><SelectTrigger className="priority-select" aria-label="Độ ưu tiên"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="high">Cao</SelectItem><SelectItem value="medium">Trung bình</SelectItem><SelectItem value="low">Thấp</SelectItem></SelectContent></Select></label>
        </div>
        <Button type="submit" className="add-button"><Plus /> Thêm vào danh sách</Button>
      </form>
      <div className="form-note"><CalendarDays aria-hidden="true" /><p><strong>Mẹo nhỏ</strong> Đặt độ ưu tiên cao cho những bài cần nhiều thời gian chuẩn bị.</p></div>
    </section>
  );
}

function AssignmentRow({ id, subject, title, dueDate, priority, completed }: { id: string; subject: string; title: string; dueDate: string; priority: Priority; completed: boolean }) {
  const dispatch = useAppDispatch();
  const overdue = getDayDistance(dueDate) < 0 && !completed;
  return (
    <article className="assignment-row" data-completed={completed}>
      <button type="button" className="check-button" data-checked={completed} onClick={() => dispatch(toggleAssignment(id))} aria-label={completed ? `Bỏ đánh dấu hoàn thành ${title}` : `Đánh dấu hoàn thành ${title}`}>{completed && <Check aria-hidden="true" />}</button>
      <div className="assignment-main">
        <div className="assignment-topline"><span className="subject"><BookOpen aria-hidden="true" /> {subject}</span><span className={`priority ${priorityMeta[priority].className}`}>{priorityMeta[priority].label}</span></div>
        <h3>{title}</h3>
        <div className="assignment-meta"><span><CalendarDays aria-hidden="true" /> {formatDate(dueDate)}</span><span className={overdue ? "is-overdue" : completed ? "is-complete" : ""}>{overdue ? <AlertCircle aria-hidden="true" /> : completed ? <CheckCircle2 aria-hidden="true" /> : <Clock3 aria-hidden="true" />}{completed ? "Đã hoàn thành" : relativeDeadline(dueDate)}</span></div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="delete-button" aria-label={`Xoá ${title}`}><Trash2 /></Button></AlertDialogTrigger>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xoá bài tập này?</AlertDialogTitle><AlertDialogDescription>“{title}” sẽ biến mất khỏi danh sách và không thể khôi phục.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Giữ lại</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => { dispatch(deleteAssignment(id)); toast.success("Đã xoá bài tập"); }}>Xoá bài tập</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </article>
  );
}

function LoadingList() {
  return <div className="loading-list" aria-label="Đang tải bài tập">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-[126px] w-full rounded-2xl" />)}</div>;
}

export function DeadlineDashboard() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.assignments);
  const { filter, setFilter, filteredItems, counts } = useDeadlineFilters(items);
  const upcoming = useMemo(() => items.filter((item) => !item.completed && getDayDistance(item.dueDate) >= 0).length, [items]);
  useDeadlineTools();

  useEffect(() => { if (status === "idle") void dispatch(fetchAssignments()); }, [dispatch, status]);

  return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="#main-list" aria-label="Về danh sách deadline"><span className="brand-mark"><CalendarDays aria-hidden="true" /></span><span><strong>Deadline</strong><small>Student tracker</small></span></a><div className="semester-chip"><span /> Học kỳ I · 2026</div></header>
      <div className="dashboard-grid">
        <aside><AssignmentForm /></aside>
        <section className="content-column" id="main-list">
          <div className="welcome-row"><div><p className="date-label">Kế hoạch học tập</p><h1>Deadline của bạn</h1><p>{upcoming > 0 ? `Bạn có ${upcoming} bài tập đang chờ xử lý.` : "Bạn đã xử lý hết các deadline hiện tại."}</p></div><div className="progress-orbit" aria-label={`${counts.completed} trên ${counts.all} bài đã hoàn thành`}><strong>{counts.all ? Math.round((counts.completed / counts.all) * 100) : 0}%</strong><span>hoàn thành</span></div></div>
          <FilterTabs value={filter} onValueChange={setFilter}><FilterTabs.List>{(Object.keys(filterLabels) as DeadlineFilter[]).map((value) => <FilterTabs.Tab key={value} value={value} count={counts[value]}>{filterLabels[value]}</FilterTabs.Tab>)}</FilterTabs.List></FilterTabs>
          {status === "loading" && <LoadingList />}
          {status === "failed" && <div className="error-state" role="alert"><AlertCircle aria-hidden="true" /><div><strong>Chưa tải được dữ liệu</strong><p>{error}</p></div><Button variant="outline" onClick={() => void dispatch(fetchAssignments())}><RotateCcw /> Thử lại</Button></div>}
          {status === "succeeded" && filteredItems.length === 0 && <Empty className="empty-state"><EmptyHeader><EmptyMedia variant="icon"><CheckCircle2 /></EmptyMedia><EmptyTitle>Không có bài tập ở mục này</EmptyTitle><EmptyDescription>Chọn bộ lọc khác hoặc thêm một bài tập mới.</EmptyDescription></EmptyHeader></Empty>}
          {status === "succeeded" && filteredItems.length > 0 && <div className="assignment-list">{filteredItems.map((assignment) => <AssignmentRow key={assignment.id} {...assignment} />)}</div>}
          <footer className="list-footer"><span>Dữ liệu mẫu được tải từ API giả lập</span><ChevronRight aria-hidden="true" /></footer>
        </section>
      </div>
    </main>
  );
}
