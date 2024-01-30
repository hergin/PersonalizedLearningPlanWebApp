import React, { useEffect } from "react";
import GoalCreator from "./GoalCreator";
import GoalEditor from "./GoalEditor";
import { GoalStepperProps, Goal } from "../types";
import { ApiClient } from "../hooks/ApiClient";

export default function GoalStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { put } = ApiClient();

  async function updateDatabase(goal: Goal) {
    try {
      console.log(`${goal.id}`);
      await put(`/goal/update/${goal.id}`, {
        name: goal.name,
        description: goal.description,
        is_complete: goal.isComplete,
        moduleId: goal.moduleId,
      });
    } catch (error: any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  return (
    <>
      <div className="flex flex-row transition-transform rounded  w-full ">
        <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
          <p className="text-[#888888] text-lg font-headlineFont">
            Goal
          </p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-[#888888] font-headlineFont">Start Date</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-[#888888] headlineFont">End Date</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-[#888888] headlineFont">Progress</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black"></p>
        </div>
      </div>
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
    </>
  );
}
