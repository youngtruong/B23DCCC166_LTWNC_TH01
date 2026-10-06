'use client';
import { Profiler, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { replaceAssignments, toggleAssignment, deleteAssignment } from '@/features/assignments/assignmentsSlice';
import { generateAssignments } from '@/features/assignments/utils';
import { UnmemoizedAssignmentCard } from '@/features/assignments/AssignmentCard';
import { AssignmentList } from '@/features/assignments/AssignmentList';
import { ThemeToggle } from '@/features/theme/ThemeContext';
export default function Benchmark() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.assignments.items);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [baseline, setBaseline] = useState(false);
  // Initialize the browser-only diagnostic fixture after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setBaseline(new URLSearchParams(location.search).get('mode') === 'baseline'); dispatch(replaceAssignments(generateAssignments())); window.assignmentMetrics = { cardRenders: 0, commits: 0, duration: 0 }; setReady(true); }, [dispatch]);
  if (!ready) return <p>Đang chuẩn bị dữ liệu…</p>;
  return <main className="app-shell" style={{ padding: 24 }}><h1>Đo danh sách 10.000 bài tập</h1><p>{baseline ? 'Trước: không memo, debounce, virtualization' : 'Sau: memo, debounce, virtualization'}</p><ThemeToggle /><input aria-label="Tìm kiếm bài tập" value={query} onChange={event => setQuery(event.target.value)} /><Profiler id="assignments" onRender={(_id, _phase, duration) => { if (window.assignmentMetrics) { window.assignmentMetrics.commits++; window.assignmentMetrics.duration += duration; } }}>
  {baseline ? items.filter(item => `${item.title} ${item.subject}`.toLowerCase().includes(query.toLowerCase())).map(assignment => <UnmemoizedAssignmentCard key={assignment.id} assignment={assignment} onToggle={id => { dispatch(toggleAssignment(id)); }} onDelete={id => { dispatch(deleteAssignment(id)); }} />) : <AssignmentList search={query} />}</Profiler></main>;
}
