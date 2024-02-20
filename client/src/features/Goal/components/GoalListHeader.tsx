import React from "react";
export function GoalListHeader() {
  return (
    <div className="flex flex-row transition-transform rounded  w-full ">
      <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
        <p className="text-[#888888] text-lg font-headlineFont">Goal</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-[#888888] font-headlineFont">Due Date</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-[#888888] headlineFont">Finish Date</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-[#888888] headlineFont">Comments</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-black"></p>
      </div>
    </div>
  );
}
