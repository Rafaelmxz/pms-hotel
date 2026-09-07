import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HousekeepingStatus } from "./housekeeping";
import { listRooms, patchRoomHousekeeping, roomKeys } from "./roomStore";

export function useRooms() {
  return useQuery({
    queryKey: roomKeys.all,
    queryFn: async () => listRooms(),
    initialData: () => listRooms(),
  });
}

export function usePatchHousekeeping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      housekeepingStatus,
    }: {
      id: string;
      housekeepingStatus: HousekeepingStatus;
    }) => patchRoomHousekeeping(id, housekeepingStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roomKeys.all });
    },
  });
}
