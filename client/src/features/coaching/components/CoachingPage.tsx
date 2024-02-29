import React from "react";

import CoachingBody from "./CoachingBody";
import SearchBar from "./SearchBar";

const CoachingPage = () => {
  return (
    <div className="h-screen bg-[#F1F1F1]">
      <div className="w-full h-1/5 bg-[#8C1515] flex items-center justify-center px-[30%]">
        <SearchBar />
      </div>
      <CoachingBody />
    </div>
  );
};

export default CoachingPage;
