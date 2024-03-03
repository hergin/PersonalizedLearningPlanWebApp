import { AxiosError } from "axios";
import { ApiClient } from "../hooks/ApiClient";
import { emptyUser } from "../types";

export const SettingsApi = (accountId: number) => {
  const { get } = ApiClient();
  
  async function FetchSettings() {
    if(accountId === emptyUser.id) {
      return;
    }

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
