import { ApiClient } from "../../../hooks/ApiClient";
import { useUser } from "../../../hooks/useUser";

export const ModuleApi = () => {
  const { user } = useUser();
  const { get, post } = ApiClient();

  async function fetchProfiles() {
    try {
      const data = await get(`/profile/get/${user.id}`);
      return data;
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }
return { fetchProfiles};
};
