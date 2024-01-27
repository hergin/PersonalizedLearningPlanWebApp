import { ApiClient } from "../hooks/ApiClient";
import { useUser } from "../hooks/useUser";

const FetchProfile = async (email:string) => {
  const { user } = useUser();
  const { get } = ApiClient();
  const { data, error } = await get(`profile/get/${email}`);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export { FetchProfile };
