import {
  isStayActiveOn,
  rooms as seedRooms,
  TODAY,
  type Room,
  reservations,
} from "@/mocks/hotelData";
import type { HousekeepingStatus } from "./housekeeping";

export type RoomState = Room & { housekeepingStatus: HousekeepingStatus };

export const roomKeys = {
  all: ["rooms"] as const,
};

const STORAGE_KEY = "pms-hotel.housekeeping.v1";

function seedStatus(room: Room): HousekeepingStatus {
  if (room.number === "402") return "manutencao";
  const occupied = reservations.some(
    (reservation) =>
      reservation.roomId === room.id && isStayActiveOn(reservation, TODAY),
  );
  return occupied ? "sujo" : "limpo";
}

function loadStore(): RoomState[] {
  const base = seedRooms.map((room) => ({
    ...room,
    housekeepingStatus: seedStatus(room),
  }));
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Record<string, HousekeepingStatus>;
    return base.map((room) => ({
      ...room,
      housekeepingStatus: saved[room.id] ?? room.housekeepingStatus,
    }));
  } catch {
    return base;
  }
}

let store: RoomState[] = loadStore();

function persist() {
  if (typeof window === "undefined") return;
  const payload: Record<string, HousekeepingStatus> = {};
  for (const room of store) payload[room.id] = room.housekeepingStatus;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function listRooms(): RoomState[] {
  return store.map((row) => ({ ...row }));
}

export async function patchRoomHousekeeping(
  id: string,
  housekeepingStatus: HousekeepingStatus,
): Promise<RoomState> {
  const index = store.findIndex((row) => row.id === id);
  if (index < 0) throw new Error("Quarto não encontrado");
  const next: RoomState = { ...store[index]!, housekeepingStatus };
  store = [...store.slice(0, index), next, ...store.slice(index + 1)];
  persist();
  return { ...next };
}
