import { useApiConnection } from "../../../hooks/useApiConnection";
import { Profile, CreateProfileProps } from "../../../types";
import { throwServerError } from "../../../utils/errorHandlers";

const ProfileApi = () => {
  const { get, post, put } = useApiConnection();
  
  async function FetchProfile(accountId: number) {
    try {
      const data = await get(`profile/get/${accountId}`);
      return data;
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function FetchAllProfiles() {
    try {
      const data = await get(`profile/get`);
      return data;
    } catch(error: unknown) {
      throwServerError(error);
    }
  }

  async function CreateProfile(values: CreateProfileProps) {
    try {
      await post("profile/create", values);
    } catch(error: unknown) {
      throwServerError(error);
    }
  }

  async function UpdateProfile(profile: Profile) {
    try {
      await put(`profile/edit/${profile.id}`, {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePicture: profile.profilePicture,
        jobTitle: profile.jobTitle,
        bio: profile.bio
      });
    } catch(error: unknown) {
      throwServerError(error);
    }
  }

  return { FetchProfile, FetchAllProfiles, CreateProfile, UpdateProfile };
};

export default ProfileApi;
