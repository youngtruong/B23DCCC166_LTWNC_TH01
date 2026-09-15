import { NextResponse } from "next/server";
import type { ApiResponse, Assignment } from "@/features/assignments/types";

function dateFromToday(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 650));
  const assignments: Assignment[] = [
    { id: "seed-1", subject: "Lập trình Web nâng cao", title: "Hoàn thiện Redux Deadline Tracker", dueDate: dateFromToday(2), priority: "high", completed: false },
    { id: "seed-2", subject: "Cơ sở dữ liệu", title: "Thiết kế ERD hệ thống thư viện", dueDate: dateFromToday(5), priority: "medium", completed: false },
    { id: "seed-3", subject: "An toàn mạng", title: "Báo cáo mô hình Zero Trust", dueDate: dateFromToday(-2), priority: "high", completed: false },
    { id: "seed-4", subject: "Trí tuệ nhân tạo", title: "Bài tập tìm kiếm A*", dueDate: dateFromToday(-5), priority: "low", completed: true },
    { id: "seed-5", subject: "Tiếng Anh B2", title: "Nộp video thuyết trình nhóm", dueDate: dateFromToday(9), priority: "medium", completed: false },
  ];

  const response: ApiResponse<Assignment[]> = {
    statusCode: 200,
    message: "Loaded sample assignments",
    data: assignments,
  };
  return NextResponse.json(response);
}
