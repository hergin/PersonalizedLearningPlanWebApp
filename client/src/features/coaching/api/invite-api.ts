import { AxiosError } from "axios";
import { ApiClient } from "../../../hooks/ApiClient";
import { CreateInvitationProps } from "../types";

export const InvitationApi = () => {
  const { post, get } = ApiClient();

  async function FetchInvitations(userID: number) {
    try {
      const response = await get(`/invite/${userID}`);
      return response.data;
    } catch (error: unknown) {
      console.error(error);
      alert(
        (error as AxiosError).message ? (error as AxiosError).message : error
      );
    }
  }

  async function CreateInvitation(values: CreateInvitationProps) {
    try {
      await post("/invite/create", values);
    } catch (error: unknown) {
      console.error(error);
      alert(
        (error as AxiosError).message ? (error as AxiosError).message : error
      );
    }
  }
  return { CreateInvitation, FetchInvitations };
};
