import type { ReactNode } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Logo } from "@/components/brand/Logo";
import { HOTEL_NAME, TODAY } from "@/mocks/hotelData";
import { cn } from "@/lib/utils";

export type PageId = "painel" | "calendario";

const NAV: { id: PageId; label: string }[] = [
  { id: "painel", label: "Painel" },
  { id: "calendario", label: "Mapa de Reservas" },
];

function formatToday(date: Date) {
  const raw = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function AppShell({
  page,
  onNavigate,
  children,
}: {
  page: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}) {
  const todayLabel = formatToday(TODAY);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate("painel")}
            className="flex min-w-0 items-center gap-2.5 text-left"
          >
            <Logo />
            <span className="min-w-0">
              <span className="font-display block truncate text-lg leading-tight font-medium tracking-tight">
                {HOTEL_NAME}
              </span>
              <span className="hidden text-xs tracking-wide text-muted-foreground uppercase sm:block">
                Gestão hoteleira · v1.2
              </span>
            </span>
          </button>

          <nav
            aria-label="Principal"
            className="ml-auto flex items-center gap-1 rounded-full bg-secondary p-1 sm:ml-8 sm:mr-auto"
          >
            {NAV.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-card text-foreground shadow-[var(--shadow-border)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <p className="hidden text-right text-sm text-muted-foreground lg:block">{todayLabel}</p>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
