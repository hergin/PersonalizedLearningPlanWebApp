import React, { useEffect, useState } from "react";
import GoalStepper from "./GoalItem";
import { ApiClient } from "../hooks/ApiClient";
import { Goal } from "../types";
import useGoals from "../hooks/useGoals";
import GoalCreator from "./GoalCreator";

const GoalHeader = ({ moduleID }: any) => {
  const [steps, setSteps] = useState<Goal[]>([]);
  const { data, isLoading, error } = useGoals(moduleID);
  console.log(steps.map((step: Goal) => step.name));
  const { get } = ApiClient();

  // useEffect(() => {
  //   async function getGoals() {
  //     try {
  //       const result = await get(`/goal/get/module/${moduleID}`);
  //       let newGoals : Goal[] = [];
  //       for (let goal of result) {
  //         newGoals.push({
  //           id: goal.goal_id,
  //           name: goal.name,
  //           description: goal.description,
  //           isComplete: goal.is_complete,
  //           moduleId: moduleID
  //         });
  //       }
  //       setSteps(newGoals);
  //     } catch (error : any) {
  //       console.error(error);
  //       alert(error.response ? error.response.data : error);
  //     }
  //   }

  //   getGoals();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const addGoal = (goal: Goal) => {
    if (steps.includes(goal)) {
      return;
    }
    let newGoals: Goal[] = ([] as Goal[]).concat(steps);
    newGoals.push(goal);
    setSteps(newGoals);
  };

  function editGoal(updatedGoal: Goal) {
    const newGoal = steps.map((goal) => {
      if (goal.id === updatedGoal.id) {
        return {
          ...goal,
          name: updatedGoal.name,
          description: updatedGoal.description,
        };
      }
      return goal;
    });
    setSteps(newGoal);
  }

  const deleteGoal = (id: number) => {
    const newGoals = steps.filter((goal) => goal.id !== id);
    setSteps(newGoals);
  };

  return (
    <div className="relative flex h-screen">
      <div className="flex w-full relative items-center bg-element-base text-text-color h-[300px] pl-[3%]">
        <div className="flex overflow-hidden bg-white flex-col absolute h-auto w-3/5 rounded min-h-[80vh] top-1/2 left-[20%] p-[3%] shadow-md gap-5">
          {data?.map((goal: Goal) => (
            <GoalStepper
              key={goal.id}
              name={goal.name}
              description={goal.description}
              id={goal.id}
            />
          ))}
          
          <GoalCreator moduleID={moduleID} addGoal={() => console.log("Hi")} />
        </div>
      </div>
    </div>
  );
};

export default GoalHeader;
