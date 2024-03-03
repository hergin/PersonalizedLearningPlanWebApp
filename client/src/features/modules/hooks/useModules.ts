import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ModuleApi } from "../api/module-api";
import { CreateModuleProps, Module } from "../../../types";

export function useModules(userId: number) {
  const { fetchModules } = ModuleApi();
  return useQuery({ queryFn: () => fetchModules(userId), queryKey: ["modules"] });
}

export function useModuleCreator() {
  const queryClient = useQueryClient();
  const { createModule } = ModuleApi();
  
  return useMutation({
    mutationFn: async (createdModule : CreateModuleProps) => {await createModule(createdModule)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["modules"]});
    },
  });
}

export function useModuleUpdater() {
  const queryClient = useQueryClient();
  const { updateModule } = ModuleApi();

  return useMutation({
    mutationFn: async (updatedModule: Module) => {await updateModule(updatedModule)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["modules"]});
    }
  });
}
