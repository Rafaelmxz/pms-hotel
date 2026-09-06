import { memo, useMemo } from "react";
import { addDays, format, isSameDay, isWeekend } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getReservationsOverlapping,
  parseISODate,
  rooms,
  stayNights,
  TODAY,
  type Reservation,
  type Room,
  type RoomType,
} from "@/mocks/hotelData";
import { cn } from "@/lib/utils";
import { STATUS_BAR, STATUS_LABEL } from "./status";

const VISIBLE_DAYS = 21;

const TYPE_ORDER: RoomType[] = ["Standard", "Luxo", "Suíte"];

type MapRow =
  | { kind: "group"; type: RoomType; count: number }
  | { kind: "room"; room: Room };

function buildRows(): MapRow[] {
  const rows: MapRow[] = [];
  for (const type of TYPE_ORDER) {
    const group = rooms.filter((room) => room.type === type);
    if (!group.length) continue;
    rows.push({ kind: "group", type, count: group.length });
    for (const room of group) rows.push({ kind: "room", room });
  }
  return rows;
}

const MAP_ROWS = buildRows();
const ROW_TRACKS = MAP_ROWS.map((row) =>
  row.kind === "group" ? "var(--timeline-group)" : "var(--timeline-row)",
).join(" ");

function clampIndex(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function barPlacement(reservation: Reservation, start: Date, days: number) {
  const checkIn = parseISODate(reservation.checkIn);
  const startOffset = Math.round((checkIn.getTime() - start.getTime()) / 86_400_000);
  const nights = stayNights(reservation.checkIn, reservation.checkOut);
  const colStart = clampIndex(startOffset, 0, days);
  const colEnd = clampIndex(startOffset + nights, 0, days);
  return { colStart, colEnd, hidden: colEnd <= colStart };
}

function toKey(day: Date) {
  return format(day, "yyyy-MM-dd");
}

const DayHeader = memo(function DayHeader({
  day,
  index,
}: {
  day: Date;
  index: number;
}) {
  const today = isSameDay(day, TODAY);
  const weekend = isWeekend(day);
  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex flex-col items-center justify-center border-l border-border bg-card",
        weekend && "bg-weekend",
        today && "bg-today",
      )}
      style={{ gridColumn: index + 2, gridRow: 1 }}
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-sm font-medium tabular-nums",
          today && "bg-primary text-primary-foreground",
        )}
      >
        {format(day, "d")}
      </span>
      <span
        className={cn(
          "mt-0.5 text-[10px] font-medium tracking-wide uppercase",
          today ? "text-primary" : "text-muted-foreground",
        )}
      >
        {today ? "hoje" : format(day, "EEE", { locale: ptBR }).replace(".", "")}
      </span>
    </div>
  );
});

const ReservationBar = memo(function ReservationBar({
  reservation,
  start,
  gridRow,
  onSelect,
}: {
  reservation: Reservation;
  start: Date;
  gridRow: number;
  onSelect: (reservation: Reservation) => void;
}) {
  const { colStart, colEnd, hidden } = barPlacement(reservation, start, VISIBLE_DAYS);
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={() => onSelect(reservation)}
      className={cn(
        "z-10 mx-1 my-1.5 truncate rounded-md px-2 text-left text-xs font-medium shadow-sm",
        STATUS_BAR[reservation.status],
      )}
      style={{
        gridColumn: `${colStart + 2} / ${colEnd + 2}`,
        gridRow,
      }}
      title={`${reservation.guestName} · ${STATUS_LABEL[reservation.status]}`}
    >
      <span className="block truncate">{reservation.guestName}</span>
    </button>
  );
});

function TimelineInner({
  start,
  onSelect,
}: {
  start: Date;
  onSelect: (reservation: Reservation) => void;
}) {
  const startMs = start.getTime();

  const days = useMemo(
    () => Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(start, i)),
    [startMs],
  );

  const items = useMemo(() => {
    const rangeEnd = addDays(start, VISIBLE_DAYS);
    return getReservationsOverlapping(start, rangeEnd);
  }, [startMs]);

  const itemsByRoom = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const item of items) {
      const list = map.get(item.roomId);
      if (list) list.push(item);
      else map.set(item.roomId, [item]);
    }
    return map;
  }, [items]);

  const visibleCount = useMemo(
    () => items.filter((reservation) => !barPlacement(reservation, start, VISIBLE_DAYS).hidden).length,
    [items, startMs],
  );

  return (
    <div className="timeline-map min-w-0 overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
      <div className="max-h-(--timeline-max-h) overflow-auto overscroll-x-contain">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `var(--timeline-sidebar) repeat(${VISIBLE_DAYS}, var(--timeline-day))`,
            gridTemplateRows: `var(--timeline-head) ${ROW_TRACKS}`,
            width: `calc(var(--timeline-sidebar) + ${VISIBLE_DAYS} * var(--timeline-day))`,
          }}
        >
          <div className="sticky top-0 left-0 z-30 flex items-end bg-card px-3 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Acomodação
          </div>
          {days.map((day, index) => (
            <DayHeader key={toKey(day)} day={day} index={index} />
          ))}

          {MAP_ROWS.map((row, rowIndex) => {
            const gridRow = rowIndex + 2;
            if (row.kind === "group") {
              return (
                <div
                  key={`group-${row.type}`}
                  className="sticky left-0 z-20 col-span-full flex items-center border-t border-border bg-secondary px-3"
                  style={{
                    gridColumn: `1 / ${VISIBLE_DAYS + 2}`,
                    gridRow,
                  }}
                >
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-foreground uppercase">
                    {row.type}
                  </span>
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    {row.count} {row.count === 1 ? "quarto" : "quartos"}
                  </span>
                </div>
              );
            }

            const roomItems = itemsByRoom.get(row.room.id) ?? [];
            return (
              <div key={row.room.id} className="contents">
                <div
                  className="sticky left-0 z-20 flex flex-col justify-center border-t border-border bg-card px-3"
                  style={{ gridColumn: 1, gridRow }}
                >
                  <span className="text-sm font-medium tabular-nums whitespace-nowrap">
                    {row.room.number}
                  </span>
                </div>
                {days.map((day, dayIndex) => (
                  <div
                    key={`${row.room.id}-${toKey(day)}`}
                    className={cn(
                      "border-t border-l border-border",
                      isWeekend(day) && "bg-weekend/70",
                      isSameDay(day, TODAY) && "bg-today/80",
                    )}
                    style={{
                      gridColumn: dayIndex + 2,
                      gridRow,
                    }}
                  />
                ))}
                {roomItems.map((reservation) => (
                  <ReservationBar
                    key={reservation.id}
                    reservation={reservation}
                    start={start}
                    gridRow={gridRow}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            );
          })}
        </div>
        {visibleCount === 0 ? (
          <p className="border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Nenhuma reserva neste período. Use Hoje ou avance as semanas.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const Timeline = memo(TimelineInner);
export { VISIBLE_DAYS };
