import { AxiosError } from "axios";
import { ApiClient } from "../hooks/ApiClient";
import { emptyUser, Settings } from "../types";

export const SettingsApi = (accountId: number) => {
  const { get, put } = ApiClient();
  
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

  async function MutateSettings(settings: Settings) {
    if(accountId === emptyUser.id) {
      return;
    }

    try {
      await put(`/settings/update/${accountId}`, settings);
    } catch(error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      alert(axiosError.response ? axiosError.response.data : error);
    }
  }

  return { FetchSettings, MutateSettings };
};
