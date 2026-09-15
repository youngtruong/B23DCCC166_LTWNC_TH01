import { Toaster } from "sonner";
import { DeadlineDashboard } from "@/components/deadlines/DeadlineDashboard";

export default function Home() {
  return (
    <><DeadlineDashboard /><Toaster position="bottom-right" richColors /></>
  );
}
