"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addAssignment, deleteAssignment, updateAssignment } from "./assignmentsSlice";
import { isPriority } from "./types";

interface WebMcpTool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): unknown | Promise<unknown>;
}

interface WebMcpContext {
  registerTool(tool: WebMcpTool, options?: { signal?: AbortSignal }): void | Promise<void>;
}

declare global {
  interface Document {
    readonly modelContext?: WebMcpContext;
  }
}

function asRecord(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null) throw new Error("Đầu vào phải là một object.");
  return input as Record<string, unknown>;
}

export function useDeadlineTools() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.assignments.items);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const register = (tool: WebMcpTool) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
      } catch {
        // Browsers without a complete WebMCP implementation keep the visible app working.
      }
    };

    register({
      name: "list_assignments",
      title: "Liệt kê bài tập",
      description: "Đọc danh sách bài tập và trạng thái hiện tại trong Student Deadline Tracker.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ assignments: items, total: items.length }),
    });

    register({
      name: "create_assignment",
      title: "Tạo bài tập",
      description: "Tạo một bài tập mới và cập nhật ngay danh sách đang hiển thị.",
      inputSchema: {
        type: "object",
        properties: {
          subject: { type: "string", minLength: 1 },
          title: { type: "string", minLength: 1 },
          dueDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["subject", "title", "dueDate", "priority"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const value = asRecord(input);
        if (typeof value.subject !== "string" || !value.subject.trim() || typeof value.title !== "string" || !value.title.trim() || typeof value.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.dueDate) || !isPriority(value.priority)) throw new Error("Thông tin bài tập không hợp lệ.");
        dispatch(addAssignment({ subject: value.subject.trim(), title: value.title.trim(), dueDate: value.dueDate, priority: value.priority }));
        return { created: true, title: value.title.trim() };
      },
    });

    register({
      name: "set_assignment_completed",
      title: "Cập nhật trạng thái bài tập",
      description: "Đặt trạng thái hoàn thành hoặc chưa hoàn thành cho một bài tập theo ID.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string", minLength: 1 }, completed: { type: "boolean" } },
        required: ["id", "completed"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const value = asRecord(input);
        if (typeof value.id !== "string" || typeof value.completed !== "boolean") throw new Error("ID hoặc trạng thái không hợp lệ.");
        if (!items.some((item) => item.id === value.id)) throw new Error("Không tìm thấy bài tập.");
        dispatch(updateAssignment({ id: value.id, changes: { completed: value.completed } }));
        return { id: value.id, completed: value.completed };
      },
    });

    register({
      name: "delete_assignment",
      title: "Xoá bài tập",
      description: "Xoá vĩnh viễn một bài tập khỏi danh sách hiện tại theo ID.",
      inputSchema: { type: "object", properties: { id: { type: "string", minLength: 1 } }, required: ["id"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const value = asRecord(input);
        if (typeof value.id !== "string" || !items.some((item) => item.id === value.id)) throw new Error("Không tìm thấy bài tập.");
        dispatch(deleteAssignment(value.id));
        return { deleted: true, id: value.id };
      },
    });

    return () => lifecycle.abort();
  }, [dispatch, items]);
}
