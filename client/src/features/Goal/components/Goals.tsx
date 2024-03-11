import React from "react";
import GoalCreator from "./GoalCreator";

const Goals = ({ children, id }: any) => {
  return (
    <div className="flex w-full relative items-center bg-element-base text-text-color h-[300px] pl-[3%]">
      <div className="flex overflow-hidden bg-white flex-col absolute h-auto w-3/5 rounded min-h-[80vh] top-1/2 left-[20%] p-[3%] shadow-md gap-5">
        {children}
        <GoalCreator moduleId={id} />
      </div>
    </div>
  );
};

export default Goals;
