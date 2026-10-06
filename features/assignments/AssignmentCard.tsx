"use client";
import { AlertCircle, BookOpen, CalendarDays, Check, CheckCircle2, Clock3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Assignment, Priority } from "./types";
import { usePinStore } from "./usePinStore";
import { getDayDistance } from "./useDeadlineFilters";
const priorityMeta: Record<Priority, { label: string; className: string }> = { high: { label: "Cao", className: "priority-high" }, medium: { label: "Trung bình", className: "priority-medium" }, low: { label: "Thấp", className: "priority-low" } };
function formatDate(date: string) { return new Intl.DateTimeFormat("vi-VN").format(new Date(`${date}T00:00:00`)); }
function relativeDeadline(date: string) { const days = getDayDistance(date); return days < 0 ? `Quá hạn ${Math.abs(days)} ngày` : `Còn ${days} ngày`; }
export function UnmemoizedAssignmentCard({ assignment, onToggle, onDelete }: { assignment: Assignment; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  // Development benchmark counts render attempts, including discarded renders.
  // eslint-disable-next-line react-hooks/immutability
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined" && window.assignmentMetrics) window.assignmentMetrics.cardRenders++;
  const { id, subject, title, dueDate, priority, completed } = assignment;
  const pinned = usePinStore(state => state.pinnedIds.includes(id));
  const togglePin = usePinStore(state => state.togglePin);
  const overdue = getDayDistance(dueDate) < 0 && !completed;
  return (
    <article className="assignment-row" data-completed={completed}>
      <button type="button" className="check-button" data-checked={completed} onClick={() => onToggle(id)} aria-label={completed ? `Bỏ đánh dấu hoàn thành ${title}` : `Đánh dấu hoàn thành ${title}`}>{completed && <Check aria-hidden="true" />}</button>
      <div className="assignment-main">
        <div className="assignment-topline"><span className="subject"><BookOpen aria-hidden="true" /> {subject}</span><span className={`priority ${priorityMeta[priority].className}`}>{priorityMeta[priority].label}</span></div>
        <h3>{title}</h3>
        <div className="assignment-meta"><span><CalendarDays aria-hidden="true" /> {formatDate(dueDate)}</span><span className={overdue ? "is-overdue" : completed ? "is-complete" : ""}>{overdue ? <AlertCircle aria-hidden="true" /> : completed ? <CheckCircle2 aria-hidden="true" /> : <Clock3 aria-hidden="true" />}{completed ? "Đã hoàn thành" : relativeDeadline(dueDate)}</span></div>
      </div>
      <div><button aria-label={`${pinned ? "Bỏ ghim" : "Ghim"} ${title}`} aria-pressed={pinned} onClick={() => togglePin(id)}>{pinned ? "★" : "☆"}</button><AlertDialog>
        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="delete-button" aria-label={`Xoá ${title}`}><Trash2 /></Button></AlertDialogTrigger>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xoá bài tập này?</AlertDialogTitle><AlertDialogDescription>“{title}” sẽ biến mất khỏi danh sách và không thể khôi phục.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Giữ lại</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => { onDelete(id); toast.success("Đã xoá bài tập"); }}>Xoá bài tập</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog></div>
    </article>
  );
}
export const AssignmentCard = memo(UnmemoizedAssignmentCard);
declare global { interface Window { assignmentMetrics?: { cardRenders: number; commits: number; duration: number } } }
