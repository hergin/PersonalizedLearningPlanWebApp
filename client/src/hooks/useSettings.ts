import { useQuery } from "@tanstack/react-query";
import { SettingsApi } from "../api/settings-api";

export default function useSettings(accountId: number) {
  const { FetchSettings } = SettingsApi();
  return useQuery({
    queryFn: () => FetchSettings(accountId.toString()),
    queryKey: ["settings"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retryDelay: 3000
  });
}
