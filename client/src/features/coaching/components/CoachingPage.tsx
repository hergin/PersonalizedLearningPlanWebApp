import React, { useState } from "react";
import SearchBar from "./SearchBar";
import UserItem from "./UserItem";
import { useAllProfiles } from "../../profile/hooks/useProfile";
import InvitationItem from "./InviteItem";
import { useCollapse } from "react-collapsed";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CoachingPage = () => {
  const { data: users, isLoading, isError } = useAllProfiles();
  const [searchQuery, setSearchQuery] = useState("");
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const filteredUsers = users?.filter((user: any) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(users);
  return (
    <div className="h-screen bg-[#F1F1F1]">
      <div className="w-full h-1/5 bg-[#8C1515] flex items-center justify-center px-[30%] flex-col">
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
        <div className="w-[800px] h-auto flex">
          <h1 className="text-4xl">
            Invitations{" "}
            <span {...getToggleProps()}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </span>
          </h1>
        </div>

        <InvitationItem
          name="John Doe"
          id="1"
          getCollapseProps={getCollapseProps}
        />
      </div>
      <div className="w-full h-auto flex items-center justify-start gap-5 p-10 flex-col">
        <div className="w-[800px] h-auto flex">
          <h1 className="text-4xl">Users</h1>
        </div>
        {filteredUsers?.map((user: any) => (
          <UserItem
            key={user.account_id}
            name={user.username}
            id={user.account_id}
          />
        ))}
      </div>
    </div>
  );
};

export default CoachingPage;
