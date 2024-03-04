import React from "react";
import SearchBar from "./SearchBar";
import UserItem from "./UserItem";
import { useAllProfiles } from "../../profile/hooks/useProfile";

const CoachingPage = () => {
  const { data: users, isLoading, isError } = useAllProfiles();
  console.log(users);
  return (
    <div className="h-screen bg-[#F1F1F1]">
      <div className="w-full h-1/5 bg-[#8C1515] flex items-center justify-center px-[30%] flex-col">
        <h2>
          <span className="text-white">
            Search for an existing user, or send and invite to them.{" "}
          </span>
        </h2>
        <div className="flex flex-row w-full">
          <SearchBar />
        </div>
      </div>
      <div className="w-full h-4/5 flex items-center justify-start gap-5 p-10 flex-col">
        {users?.map((user: any) => (
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
