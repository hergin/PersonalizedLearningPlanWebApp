import { GoalListHeader } from "./GoalListHeader";
import React, { useState } from "react";
import GoalCreator from "./GoalCreator";
import GoalEditor from "./GoalEditor";
import { GoalStepperProps, Goal } from "../types";
import { ApiClient } from "../hooks/ApiClient";
import { SubGoalsCollapsable } from "./SubGoalsCollapsable";
import { useCollapse } from "react-collapsed";
import { Checkbox } from "@mui/material";

export default function GoalStepper( {name, description, id } : Goal) {
  const { put } = ApiClient();
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

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
    <div>
      <GoalListHeader />
      <div className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-black divide-x">
        <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
          <p className="text-black text-lg font-bodyFont">{name}</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black font-bodyFont">{description}</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black">{id}</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black">0/1</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <button {...getToggleProps()} className="text-black">
            {isExpanded ? "-" : "+"}
          </button>
        </div>
      </div>
      <SubGoalsCollapsable getCollapseProps={getCollapseProps} />
    </div>
  );
}
