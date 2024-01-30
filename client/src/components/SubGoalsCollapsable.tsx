import React from "react";
export function SubGoalsCollapsable({ isExpanded, goalId }: any) {
  return (
    <div className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-[#F4F4F4] divide-x">
      <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
        <p className="text-black text-lg font-bodyFont">
          This is the first goal sdsdasda
        </p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-black font-bodyFont">12-32-4155</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-black">12-33-4444</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-black">0/1</p>
      </div>
      <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
        <p className="text-black">+</p>
      </div>
    </div>
  );
}
