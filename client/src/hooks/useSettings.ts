import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsApi } from "../api/settings-api";
import { Settings } from "../types";

export function useSettings(accountId: number) {
  const { FetchSettings } = SettingsApi(accountId);
  
  return useQuery({
    queryFn: () => FetchSettings(),
    queryKey: ["settings"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retryDelay: 3000
  });
}

export function useSettingsMutation(accountId: number) {
  const queryClient = useQueryClient();
  const { MutateSettings } = SettingsApi(accountId);

  return useMutation({
    mutationFn: async (settings: Settings) => {await MutateSettings(settings)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["settings"]})
    }
  })
}
