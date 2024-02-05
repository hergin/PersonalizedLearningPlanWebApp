import { useMutation, useQuery } from "@tanstack/react-query";
import { ModuleApi } from "../api/module-api";

export function useModules() {
  const { fetchModules } = ModuleApi();
  return useQuery({ queryFn: () => fetchModules(), queryKey: ["modules"] });
}

export function MutateModules({ module_name, description }: any) {
  const { createModule } = ModuleApi();
  return useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      console.log("Module created successfully");
    },
  });
}
