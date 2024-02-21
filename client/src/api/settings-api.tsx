import { AxiosError } from "axios";
import { ApiClient } from "../hooks/ApiClient";
import { useUser } from "../hooks/useUser";

export const SettingsApi = (accountId: number) => {
  const { get } = ApiClient();
  
  async function FetchSettings() {
    try {
      const data = await get(`/settings/get/${accountId}`);
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      alert(axiosError.response ? axiosError.response.data : error);
    }
  }

  return { FetchSettings };
};
