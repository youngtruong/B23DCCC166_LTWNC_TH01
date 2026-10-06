import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Assignment, AssignmentPatch, CreateAssignmentInput, LoadStatus } from "./types";
import { isAssignmentResponse } from "./types";

interface AssignmentsState {
  items: Assignment[];
  status: LoadStatus;
  error: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchAssignments = createAsyncThunk<Assignment[], void, { rejectValue: string }>(
  "assignments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/assignments");
      if (!response.ok) return rejectWithValue("Không thể tải danh sách bài tập.");
      const payload: unknown = await response.json();
      if (!isAssignmentResponse(payload)) return rejectWithValue("API trả về dữ liệu không hợp lệ.");
      return payload.data;
    } catch {
      return rejectWithValue("Mất kết nối tới API giả lập.");
    }
  },
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    replaceAssignments(state, action: PayloadAction<Assignment[]>) {
      state.items = action.payload; state.status = "succeeded"; state.error = null;
    },
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.unshift(action.payload);
      },
      prepare(input: CreateAssignmentInput) {
        return { payload: { ...input, id: crypto.randomUUID(), completed: false } };
      },
    },
    updateAssignment(state, action: PayloadAction<{ id: string; changes: AssignmentPatch }>) {
      const item = state.items.find((assignment) => assignment.id === action.payload.id);
      if (item) Object.assign(item, action.payload.changes);
    },
    toggleAssignment(state, action: PayloadAction<string>) {
      const item = state.items.find((assignment) => assignment.id === action.payload);
      if (item) item.completed = !item.completed;
    },
    deleteAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((assignment) => assignment.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        if (state.status !== "loading") return;
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        if (state.status !== "loading") return;
        state.status = "failed";
        state.error = action.payload ?? "Đã có lỗi xảy ra.";
      });
  },
});

export const { addAssignment, updateAssignment, toggleAssignment, deleteAssignment, replaceAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
