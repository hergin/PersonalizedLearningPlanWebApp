import { useApiConnection } from "../../../hooks/useApiConnection";
import { throwServerError } from "../../../utils/errorHandlers";
import { CreateModuleProps, Module } from "../../../types";

export const ModuleApi = () => {
  const { get, post, put, del } = useApiConnection();

  async function fetchModules(userId: number) {
    try {
      return await get(`/module/get/${userId}`);
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function createModule({ module_name, description, account_id }: CreateModuleProps) {
    try {
      return await post("/module/add", {
        name: module_name,
        description,
        completionPercent: 0,
        accountId: account_id,
      });
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function updateModule(module: Module) {
    try {
      return await put(`/module/edit/${module.id}`, {
        name: module.name,
        description: module.description,
        completion: module.completion 
      });
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function deleteModule(id: number) {
    try {
      return await del(`/module/delete/${id}`);
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  return { fetchModules, createModule, updateModule, deleteModule };
};
