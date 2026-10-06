"use client";
import { CalendarDays, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import { useAppDispatch } from "@/app/hooks";
import { addAssignment } from "./assignmentsSlice";
import type { CreateAssignmentInput, Priority } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export function AssignmentForm() {
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

