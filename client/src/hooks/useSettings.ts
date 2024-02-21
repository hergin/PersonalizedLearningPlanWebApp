import { useQuery } from "@tanstack/react-query";
import { SettingsApi } from "../api/settings-api";

export default function useSettings(accountId: number) {
  const { FetchSettings } = SettingsApi(accountId);
  return useQuery({
    queryFn: () => FetchSettings(),
    queryKey: ["settings"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retryDelay: 3000
  });
}
