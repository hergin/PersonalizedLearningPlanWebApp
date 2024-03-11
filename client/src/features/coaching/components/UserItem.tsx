import React from "react";
import { useInviteCreator } from "../hooks/useInvite";
import { useUser } from "../../login/hooks/useUser";
import { PublicUsers } from "../types";

const UserItem = ({ username, account_id }: PublicUsers) => {
  const { mutateAsync: createInvite } = useInviteCreator();
  const { user } = useUser();

  async function sendInvite() {
    await createInvite({ senderId: user.id, recipientId: account_id });
    alert(`Invite sent to ${name} with id: ${account_id}!`);
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
          <h1 className="text-3xl text-black">{username}</h1>
        </div>
        <div>
          <button
            className="bg-[#8C1515] text-white p-2 rounded-lg m-2"
            onClick={sendInvite}
          >
            Send Invite
          </button>
        </div>
      </div>
    </>
  );
};

export default UserItem;
