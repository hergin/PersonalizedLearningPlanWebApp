import { ApiClient } from "../../../hooks/ApiClient";

export const TagApi = (accountID: number) => {
  const { get } = ApiClient();
  
  async function FetchTags() {
    try {
      const data = await get(`/tag/get/${accountID}`);
      return data;
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }
  
  return { FetchTags };
};
