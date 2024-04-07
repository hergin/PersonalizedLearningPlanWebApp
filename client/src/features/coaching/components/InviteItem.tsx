import { Alert } from "@mui/material";
import React from "react";
import { useInviteAccepter, useInviteDecliner } from "../hooks/useInvites";

interface InvitationItemProps {
  id: number,
  name: string,
  recipientId: number,
  senderId: number
}

const InvitationItem = ({ name, id, recipientId, senderId }: InvitationItemProps) => {
  const { mutateAsync: acceptInvite } = useInviteAccepter(); 
  const { mutateAsync: declineInvite } = useInviteDecliner(); 

  async function AcceptInvite() {
    await acceptInvite({id, recipientId, senderId});
    alert(`Invite accepted`);
  }

  async function DeclineInvite() {
    await declineInvite(id);
    alert(`Invite declined`);
  }

  return (
    <>
      <div className="flex flex-row transition-transform rounded border border-solid border-black w-[800px] h-[100px] shadow-md bg-white items-center justify-between">
        <div className="flex flex-row items-center">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Avatar"
            className="w-20 h-20 rounded-full m-4"
          />
          <h1 className="text-3xl text-black"> Invitation from {name}</h1>
        </div>
        <div>
          <button
            className="bg-[#8C1515] text-white p-2 rounded-lg m-2"
            onClick={AcceptInvite}
          >
            Accept
          </button>
          <button
            className="bg-[#8C1515] text-white p-2 rounded-lg m-2"
            onClick={DeclineInvite}
          >
            Decline
          </button>
        </div>
      </div>
    </>
  );
};

export default InvitationItem;
