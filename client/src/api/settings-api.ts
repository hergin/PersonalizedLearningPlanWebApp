import { AxiosError } from "axios";
import { ApiClient } from "../hooks/ApiClient";
import { defaultSettings, emptyUser, Settings } from "../types";

export const SettingsApi = () => {
  const { get, put } = ApiClient();
  
  async function FetchSettings(accountId: number) {
    if(accountId === emptyUser.id) {
      return [defaultSettings];
    }

    try {
      return await get(`/settings/get/${accountId}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      alert(axiosError.response ? axiosError.response.data : error);
    }
  }

  async function MutateSettings(accountId: number, settings: Settings) {
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
