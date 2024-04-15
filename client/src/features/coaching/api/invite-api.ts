import { AxiosError } from "axios";
import { useApiConnection } from "../../../hooks/useApiConnection";
import { CreateInvitationProps } from "../types";

export const InvitationApi = () => {
  const { post, get } = useApiConnection();

  async function FetchInvitations(id: number) {
    try {
      const response = await get(`/invite/${id}`);
      return response;
    } catch (error: unknown) {
      console.error(error);
      alert(
        (error as AxiosError).message ? (error as AxiosError).message : error
      );
    }
  }

  async function FetchPendingInvitations(id: number) {
    try {
      const response = await get(`/invite/pending/${id}`);
      return response;
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

  async function AcceptInvitation({ id, senderId, recipientId }: any) {
    try {
      await post(`/invite/accept/${id}`, { senderId, recipientId });
    } catch (error: unknown) {
      console.error(error);
      alert(
        (error as AxiosError).message ? (error as AxiosError).message : error
      );
    }
  }
  async function DeclineInvitation(id: number) {
    try {
      await post(`/invite/reject/${id}`, {});
    } catch (error: unknown) {
      console.error(error);
      alert(
        (error as AxiosError).message ? (error as AxiosError).message : error
      );
    }
  }

  return {
    CreateInvitation,
    FetchInvitations,
    AcceptInvitation,
    DeclineInvitation,
    FetchPendingInvitations,
  };
};
