import { useApiConnection } from "../../../hooks/useApiConnection";
import { Profile, CreateProfileProps } from "../../../types";
import { AxiosError } from "axios";

export const ProfileApi = () => {
  const { get, post, put } = useApiConnection();
  
  async function FetchProfile(accountId: number) {
    try {
      const data = await get(`profile/get/${accountId}`);
      return data;
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function FetchAllProfiles() {
    try {
      const data = await get(`profile/get`);
      return data;
    } catch(error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function CreateProfile(values: CreateProfileProps) {
    try {
      await post("/profile/create", values);
    } catch(error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function UpdateProfile(profile: Profile) {
    try {
      await put(`profile/edit/${profile.id}`, profile);
    } catch(error: unknown) {
      console.error(JSON.stringify(error));
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  return { FetchProfile, FetchAllProfiles, CreateProfile, UpdateProfile };
};
