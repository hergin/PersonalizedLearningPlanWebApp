import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsApi } from "../api/settings-api";
import { Settings } from "../types";

export function useSettings(accountId: number) {
  const { FetchSettings } = SettingsApi();
  
  return useQuery({
    queryFn: () => FetchSettings(accountId),
    queryKey: ["settings"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retryDelay: 3000
  });
}

export function useSettingsMutation(accountId: number) {
  const queryClient = useQueryClient();
  const { MutateSettings } = SettingsApi();

  return useMutation({
    mutationFn: async (settings: Settings) => {await MutateSettings(accountId, settings)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["settings"]})
    }
  });
}
