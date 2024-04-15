export interface PublicUsers {
  account_id: number;
  profile_id?: string;
  username: string;
  isPending?: boolean;

}
export interface CreateInvitationProps {
  senderId: number;
  recipientId: number;
}
