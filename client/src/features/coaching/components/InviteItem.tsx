import React from "react";
import { useInviteCreator } from "../hooks/useCoach";
import { useUser } from "../../login/hooks/useUser";

const InvitationItem = ({ name, id }: any) => {
  const { mutateAsync: createInvite } = useInviteCreator();
  const {user} = useUser();

  async function sendInvite() {
    await createInvite({senderID: user.id, receiverID: id});
    alert(`Invite sent to ${name} with id: ${id}!`);
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
          <h1 className="text-3xl text-black">{name}</h1>
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

export default InvitationItem;
