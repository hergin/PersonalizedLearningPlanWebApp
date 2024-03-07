import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { InvitationApi } from "../api/invite-api";
import { CreateInvitationProps } from "../types";

export function useFetchInvites(userId: number) {
  const { FetchInvitations } = InvitationApi();
  return useQuery({
    queryFn: () => FetchInvitations(userId),
    queryKey: ["invites"],
  });
}

export function useInviteCreator() {
  const queryClient = useQueryClient();
  const { CreateInvitation } = InvitationApi();

  return useMutation({
    mutationFn: async (createdInvite: CreateInvitationProps) => {
      await CreateInvitation(createdInvite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}
