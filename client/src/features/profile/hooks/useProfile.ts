import { useQuery } from "@tanstack/react-query";
import { ProfileApi } from "../api/profile-api";

export default function useProfile() {
  const { FetchProfile } = ProfileApi();
  console.log(FetchProfile());
  return useQuery({ queryFn: () => FetchProfile(), queryKey: ["profile"] });
}
