import { ApiClient } from "../hooks/ApiClient";

export const GoalApi = (moduleID: string) => {
  const { get } = ApiClient();
  async function FetchGoals() {
    try {
        const data = await get(`/goal/get/module/${moduleID}`);
      return data;
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }
  return { FetchGoals };
};
