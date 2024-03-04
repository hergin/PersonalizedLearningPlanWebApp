import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InvitationApi } from "../api/coaching-api";
import { CreateInvitationProps } from "../../../types";

export function useInviteCreator() {
  const queryClient = useQueryClient();
  const { CreateInvitation } = InvitationApi();
  
  return useMutation({
    mutationFn: async (createdInvite : CreateInvitationProps) => {await CreateInvitation(createdInvite)},
    onSuccess: () => {
      // queryClient.invalidateQueries({queryKey: ["modules"]});
      console.log("Invite sent!");
    },
  });
}
