import { ApiClient } from "../hooks/ApiClient";
import { useUser } from "../hooks/useUser";

export const ModuleApi = () => {
  const { user } = useUser();
  const { get, post } = ApiClient();

  async function fetchModules() {
    try {
      const data = await get(`/module/get/${user.email}`);
      return data;
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  async function createModule({ module_name, description }: any) {
    try {
      const response = await post("/module/add", {
        module_name: module_name,
        description,
        completion_percent: 10,
        email: user.email,
      });
      return response;
    } catch (error: any) {
      console.log(module_name, description);
      console.error(error);
    }
  }
  return { fetchModules, createModule };
};
