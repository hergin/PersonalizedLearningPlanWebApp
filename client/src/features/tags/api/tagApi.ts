import { useApiConnection } from "../../../hooks/useApiConnection";
import { throwServerError } from "../../../utils/errorHandlers";
import { Tag } from "../../../types";

export const TagApi = () => {
  const { get, post, del } = useApiConnection();
  
  async function fetchTags(accountID: number) {
    try {
      const data = await get(`/tag/get/${accountID}`);
      return data;
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function createTag(tag: Tag) {
    try {
      return await post("/tag/add", tag);
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function deleteTag(id: number) {
    try {
      return await del(`/tag/delete/${id}`);
    } catch(error: unknown) {
      throwServerError(error);
    }
  }
  
  return { fetchTags, createTag, deleteTag };
};
