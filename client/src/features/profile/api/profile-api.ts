import { ApiClient } from "../../../hooks/ApiClient";
import { useUser } from "../../../hooks/useUser";

export const ProfileApi = () => {
  const { user } = useUser();
  const { get } = ApiClient();
  async function FetchProfile() {
    try {
      const data = await get(`profile/get/${user.email}`);
      return data;
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }
  return { FetchProfile };
};
