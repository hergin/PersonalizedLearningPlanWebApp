import { ApiClient } from "../../../hooks/ApiClient";
import { AxiosError } from "axios";
import { CreateModuleProps, Module } from "../../../types";

export const ModuleApi = () => {
  const { get, post, put } = ApiClient();

  async function fetchModules(userId: number) {
    try {
      return await get(`/module/get/${userId}`);
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
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
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
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
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  return { fetchModules, createModule, updateModule };
};
