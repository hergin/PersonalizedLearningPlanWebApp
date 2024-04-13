import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileApi from "../api/profile-api";
import { CreateProfileProps, Profile } from "../../../types";

export function useProfile(accountId: number) {
  const { FetchProfile } = ProfileApi();
  return useQuery({ queryFn: () => FetchProfile(accountId), queryKey: ["profile", accountId] });
}

export function useCoachProfiles() {
  const { fetchCoaches } = ProfileApi();
  return useQuery({
    queryFn: () => fetchCoaches(),
    queryKey: ["profile"]
  });
}

export function useProfileCreator(accountId: number) {
  const queryClient = useQueryClient();
  const { CreateProfile } = ProfileApi();

  return useMutation({
    mutationFn: async (values: CreateProfileProps) => {await CreateProfile(values)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["profile", accountId]});
    }
  })
}

export function useProfileUpdater(accountId: number) {
  const queryClient = useQueryClient();
  const { UpdateProfile } = ProfileApi();

  return useMutation({
    mutationFn: async (profile: Profile) => {await UpdateProfile(profile)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["profile", accountId]});
    }
  });
}
