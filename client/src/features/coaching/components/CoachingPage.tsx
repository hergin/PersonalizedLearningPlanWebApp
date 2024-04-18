import React, { useState } from "react";
import SearchBar from "./SearchBar";
import UserItem from "./UserItem";
import { useCoachProfiles } from "../../profile/hooks/useProfile";
import InvitationItem from "./InviteItem";
import {
  useFetchInvites,
  useFetchPendingInvitations,
} from "../hooks/useInvites";
import { useUser } from "../../login/hooks/useUser";
import { PublicUsers } from "../types";
import { useUnderstudies } from "../../login/hooks/useUnderstudies";
import { Understudy } from "../../../types";

const CoachingPage = () => {
  const { user } = useUser();
  const {
    data: users,
    isLoading: profileLoading,
    isError: profileError,
  } = useCoachProfiles();
  const {
    data: invites,
    isLoading: inviteLoading,
    isError: inviteError,
  } = useFetchInvites(user.id);
  const {
    data: pendingInvites,
    isLoading: pendingInviteLoading,
    isError: pendingInviteError,
  } = useFetchPendingInvitations(user.id);
  const {
    data: understudies,
    isLoading: understudiesIsLoading,
    isError: understudiesError
  } = useUnderstudies(user.id);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users?.filter(
    (publicUser: PublicUsers) =>
      publicUser.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      publicUser.account_id !== user.id
  );

  if (profileLoading || inviteLoading || pendingInviteLoading || understudiesIsLoading) return <div>Loading...</div>;

  if (profileError || inviteError || pendingInviteError || understudiesError) return <div>Error...</div>;

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <div className="w-full h-auto bg-[#8C1515] flex items-center justify-center px-[30%] py-[2%] flex-col">
        <h2>
          <span className="text-white text-xl">
            Search for an existing user, or send and invite to them.{" "}
          </span>
        </h2>
        <div className="flex flex-row w-full">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      <div className="w-full h-auto p-10 flex gap-5 items-center justify-center px-[30%] flex-col">
        {invites?.map((invite: any) => (
          <InvitationItem
            key={invite.id}
            name={invite.sender_username}
            id={invite.id}
            recipientId={invite.recipient_id}
            senderId={invite.sender_id}
          />
        ))}
        {
          understudies?.length > 0 && (
            <div className="flex flex-col text-left gap-5 p-10">
              <p className="text-3xl">Understudies</p>
              {understudies?.map((understudy: Understudy) => (
                <UserItem
                  key={`KEY-${understudy.account_id}`}
                  accountId={understudy.account_id}
                  username={understudy.username}
                />
              ))}
            </div>
          )
        }
      </div>
      <div className="w-full h-auto flex items-center justify-start gap-5 p-10 flex-col">
        <div className="w-[800px] h-auto flex">
          <h1 className="text-3xl">Coaches</h1>
        </div>
        {filteredUsers?.map((user: PublicUsers) => (
          <UserItem
            key={user.account_id}
            username={user.username}
            accountId={user.account_id}
            isPending={pendingInvites?.some(
              (invite: any) => invite.recipient_id === user.account_id
            )}
            hasInviteButton
          />
        ))}
      </div>
    </div>
  );
};

export default CoachingPage;
