import { useQuery } from "@tanstack/react-query";
import { FetchProfile } from "../api/profile-api";

export default function useProfile(email:string) {
  return useQuery({ queryKey: ["profiles"], queryFn: () => FetchProfile(email) });
}
