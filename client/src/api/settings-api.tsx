import { ApiClient } from "../hooks/ApiClient";

export const SettingsApi = () => {
  const { get } = ApiClient();
  
  async function FetchSettings(accountId: string) {
    try {
      const data = await get(`/settings/get/${accountId}`);
      return data;
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  return { FetchSettings };
};
