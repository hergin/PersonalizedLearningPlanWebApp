import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TagApi } from "../api/tagApi";
import { Tag } from "../../../types";

export function useTags(accountId: number) {
  const { fetchTags } = TagApi();
  
  return useQuery({
    queryFn: async () => await fetchTags(accountId),
    queryKey: ["tags"],
  });  
}

export function useTagCreator() {
  const queryClient = useQueryClient();
  const { createTag } = TagApi();

  return useMutation({
    mutationFn: async (tag: Tag) => {await createTag(tag)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tags"]})
    }
  });
}

export function useTagRemover() {
  const queryClient = useQueryClient();
  const { deleteTag } = TagApi();
  return useMutation({
    mutationFn: async (id: number) => {await deleteTag(id)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tags"]})
    }
  });
}
