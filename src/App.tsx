import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell, type PageId } from "@/features/layout/AppShell";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { CalendarPage } from "@/features/reservations/CalendarPage";

export default function App() {
  const [page, setPage] = useState<PageId>("painel");

  return (
    <AppShell page={page} onNavigate={setPage}>
      <ErrorBoundary>
        {page === "painel" ? <DashboardPage /> : <CalendarPage />}
      </ErrorBoundary>
    </AppShell>
  );
}
