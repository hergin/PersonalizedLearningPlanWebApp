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

export function useFetchPendingInvitations(userId: number) {
  const { FetchPendingInvitations } = InvitationApi();
  return useQuery({
    queryFn: () => FetchPendingInvitations(userId),
    queryKey: ["pendinginvites"],
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
      queryClient.invalidateQueries({ queryKey: ["pendinginvites"] });
    },
  });
}

export function useInviteAccepter() {
  const queryClient = useQueryClient();
  const { AcceptInvitation } = InvitationApi();

  return useMutation({
    mutationFn: async (invite: any) => {
      await AcceptInvitation(invite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}

export function useInviteDecliner() {
  const queryClient = useQueryClient();
  const { DeclineInvitation } = InvitationApi();

  return useMutation({
    mutationFn: async (id: number) => {
      await DeclineInvitation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}
