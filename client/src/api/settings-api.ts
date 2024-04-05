import { useApiConnection } from "../hooks/useApiConnection";
import { defaultSettings, emptyUser, Settings } from "../types";
import { throwServerError } from "../utils/errorHandlers";

export const SettingsApi = () => {
  const { get, put } = useApiConnection();
  
  async function FetchSettings(accountId: number) {
    if(accountId === emptyUser.id) {
      return [defaultSettings];
    }

    try {
      return await get(`/settings/get/${accountId}`);
    } catch (error: unknown) {
      throwServerError(error);
      return [defaultSettings];
    }
  }

  async function MutateSettings(accountId: number, settings: Settings) {
    if(accountId === emptyUser.id) {
      return;
    }

    try {
      await put(`/settings/update/${accountId}`, settings);
    } catch(error: unknown) {
      throwServerError(error);
    }
  }

  return { FetchSettings, MutateSettings };
};
