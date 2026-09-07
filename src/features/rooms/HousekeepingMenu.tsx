import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HOUSEKEEPING_DOT,
  HOUSEKEEPING_LABEL,
  HOUSEKEEPING_ORDER,
  type HousekeepingStatus,
} from "./housekeeping";
import type { RoomState } from "./roomStore";
import { usePatchHousekeeping } from "./useRooms";

export function HousekeepingMenu({ room }: { room: RoomState }) {
  const patch = usePatchHousekeeping();
  const status = room.housekeepingStatus;

  async function select(next: HousekeepingStatus) {
    if (next === status) return;
    await patch.mutateAsync({ id: room.id, housekeepingStatus: next });
  }

  return (
    <details className="relative">
      <summary
        className="flex cursor-pointer list-none items-center gap-1 rounded-md py-0.5 pr-0.5 hover:bg-secondary"
        title={`${HOUSEKEEPING_LABEL[status]} — alterar status`}
      >
        <span className={cn("size-2 shrink-0 rounded-full", HOUSEKEEPING_DOT[status])} />
        <MoreHorizontal className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
      </summary>
      <div className="absolute top-full left-0 z-50 mt-1 min-w-40 rounded-lg bg-popover p-1 text-popover-foreground shadow-[var(--shadow-border)]">
        <p className="px-2 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          Quarto {room.number}
        </p>
        {HOUSEKEEPING_ORDER.map((option) => {
          const active = option === status;
          return (
            <button
              key={option}
              type="button"
              disabled={patch.isPending}
              onClick={(event) => {
                event.preventDefault();
                const root = event.currentTarget.closest("details");
                if (root) root.removeAttribute("open");
                void select(option);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs",
                active ? "bg-secondary font-medium" : "hover:bg-secondary/70",
              )}
            >
              <span className={cn("size-2 rounded-full", HOUSEKEEPING_DOT[option])} />
              {HOUSEKEEPING_LABEL[option]}
            </button>
          );
        })}
      </div>
    </details>
  );
}
