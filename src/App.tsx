import { useState } from "react";
import { AppShell, type PageId } from "@/features/layout/AppShell";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { CalendarPage } from "@/features/reservations/CalendarPage";

export default function App() {
  const [page, setPage] = useState<PageId>("painel");

  return (
    <AppShell page={page} onNavigate={setPage}>
      {page === "painel" ? <DashboardPage /> : <CalendarPage />}
    </AppShell>
  );
}
