import { ApiClient } from "../../../hooks/ApiClient";
import { AxiosError } from "axios";
import { Tag } from "../../../types";

export const TagApi = () => {
  const { get, post, del } = ApiClient();
  
  async function fetchTags(accountID: number) {
    try {
      const data = await get(`/tag/get/${accountID}`);
      return data;
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function createTag(tag: Tag) {
    try {
      return await post("/tag/add", tag);
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function deleteTag(id: number) {
    try {
      return await del(`/tag/delete/${id}`);
    } catch(error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }
  
  return { fetchTags, createTag, deleteTag };
};
