import { ApiClient } from "../../../hooks/ApiClient";
import { AxiosError } from "axios";

export const TagApi = (accountID: number) => {
  const { get } = ApiClient();
  
  async function FetchTags() {
    try {
      const data = await get(`/tag/get/${accountID}`);
      return data;
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }
  
  return { FetchTags };
};
