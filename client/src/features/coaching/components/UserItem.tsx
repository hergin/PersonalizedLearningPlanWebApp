import React from "react";
import { useInviteCreator } from "../hooks/useInvites";
import { useUser } from "../../login/hooks/useUser";
import { PublicUsers } from "../types";
import { Link } from "react-router-dom";

const BUTTON_STYLE = "bg-[#8C1515] text-white p-2 rounded-lg m-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base";

interface UserItemProps {
  accountId: number,
  username: string,
  hasInviteButton?: boolean,
  isPending?: boolean
}

const UserItem = ({accountId, username, hasInviteButton, isPending, ...other}: UserItemProps) => {
  const { mutateAsync: createInvite } = useInviteCreator();
  const { user } = useUser();

  return (
    <>
      <div 
        className="flex flex-row transition-transform rounded border border-solid border-black w-[800px] h-[100px] shadow-md bg-white items-center justify-between"
        {...other}
      >
        <div className="flex flex-row items-center">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Avatar"
            className="w-20 h-20 rounded-full m-4"
          />
          <h1 className="text-3xl text-black">{username}</h1>
        </div>
        <div>
          {
            hasInviteButton && (
              <button
                className="bg-[#8C1515] text-white p-2 rounded-lg m-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
                onClick={async () => await createInvite({ senderId: user.id, recipientId: accountId })}
                disabled={isPending}
              >
                Send Invite
              </button>
            )
          }
          <Link to={`/chat/${accountId}`}>
            <button
              className={BUTTON_STYLE}
            >
              Message
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserItem;
