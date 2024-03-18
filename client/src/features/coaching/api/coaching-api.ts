import { AxiosError } from "axios";
import { CreateInvitationProps } from "../../../types";
import { useApiConnection } from "../../../hooks/useApiConnection";

export const InvitationApi = () => {
const { post } = useApiConnection();

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
