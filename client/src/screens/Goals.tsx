import React from "react";
import GoalCreator from "../components/GoalCreator";
import { useParams } from "react-router-dom";
import GoalItem from "../components/GoalItem";

const Goals = ( {children, id}: any) => {

  // const addGoal = (goal: Goal) => {
  //   if (steps.includes(goal)) {
  //     return;
  //   }
  //   let newGoals: Goal[] = ([] as Goal[]).concat(steps);
  //   newGoals.push(goal);
  //   setSteps(newGoals);
  // };

  // function editGoal(updatedGoal: Goal) {
  //   const newGoal = steps.map((goal) => {
  //     if (goal.id === updatedGoal.id) {
  //       return {
  //         ...goal,
  //         name: updatedGoal.name,
  //         description: updatedGoal.description,
  //       };
  //     }
  //     return goal;
  //   });
  //   setSteps(newGoal);
  // }

  // const deleteGoal = (id: number) => {
  //   const newGoals = steps.filter((goal) => goal.id !== id);
  //   setSteps(newGoals);
  // };

  return (
    <div className="flex w-full relative items-center bg-element-base text-text-color h-[300px] pl-[3%]">
      <div className="flex overflow-hidden bg-white flex-col absolute h-auto w-3/5 rounded min-h-[80vh] top-1/2 left-[20%] p-[3%] shadow-md gap-5">
        {children}
        <GoalCreator
          moduleID={id as string}
          addGoal={() => console.log("Hi")}
        />
      </div>
    </div>
  );
};

export default Goals;
