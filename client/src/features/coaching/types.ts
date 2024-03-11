export interface PublicUsers {
  account_id: number;
  profile_id?: string;
  username: string;

}
export interface CreateInvitationProps {
    senderId: number;
    recipientId: number;
  }
