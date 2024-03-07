import { AxiosError } from "axios";
import { CreateInvitationProps } from "../../../types";
import { ApiClient } from "../../../hooks/ApiClient";

export const InvitationApi = () => {
const { post } = ApiClient();

async function CreateInvitation(values: CreateInvitationProps) {
    try {
      await post("/invite/create", values);
    } catch(error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }
    return { CreateInvitation };
};
