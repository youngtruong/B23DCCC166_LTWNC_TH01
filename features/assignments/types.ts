export type Priority = "high" | "medium" | "low";
export type DeadlineFilter = "all" | "pending" | "overdue" | "completed";
export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type CreateAssignmentInput = Omit<Assignment, "id" | "completed">;
export type AssignmentPatch = Partial<Pick<Assignment, "completed" | "priority" | "dueDate">>;

export function isPriority(value: unknown): value is Priority {
  return value === "high" || value === "medium" || value === "low";
}

export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.subject === "string" &&
    typeof item.title === "string" &&
    typeof item.dueDate === "string" &&
    isPriority(item.priority) &&
    typeof item.completed === "boolean"
  );
}

export function isAssignmentResponse(value: unknown): value is ApiResponse<Assignment[]> {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Record<string, unknown>;
  return (
    response.statusCode === 200 &&
    typeof response.message === "string" &&
    Array.isArray(response.data) &&
    response.data.every(isAssignment)
  );
}
