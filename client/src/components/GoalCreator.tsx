import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { ApiClient } from "../hooks/ApiClient";
import { useHotKeys } from "../hooks/useHotKeys";
import { GoalCreatorProps } from "../types";
import { DatePicker } from "@mui/x-date-pickers";
import { Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function GoalCreator({ moduleID, addGoal }: GoalCreatorProps) {
  const [goalName, setGoalName] = useState("");
  const [description, setDescription] = useState("");
  const GoalTypes = {
    TODO: "todo",
    DAILY: "daily",
  };
  const [goalType, setGoalType] = useState(GoalTypes.TODO);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const submitDisabled = goalName === "" || description === "";
  const { post } = ApiClient();
  const { handleEnterPress } = useHotKeys();

  async function handleGoalCreation() {
    try {
      const response = await post("/goal/add", {
        name: goalName,
        description: description,
        goal_type: goalType,
        isComplete: false,
        module_id: moduleID,
        dueDate: null,
      });
      console.log(response[0].goal_id);
      console.log("Goal creation is not implemented yet.");
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
      <button
        className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-black justify-center items-center hover:scale-105"
        onClick={() => setOpen(true)}
      >
        <h1 className="text-black font-headlineFont text-4xl">Add Goal</h1>
      </button>
      <Modal
        className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
          <div className="w-full flex justify-center">
            <h1 className="font-headlineFont text-5xl">Create a new goal</h1>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center gap-10">
            <input
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
              name="module"
              type="text"
              placeholder="Goal Name"
              value={goalName}
              onChange={(event) => {
                setGoalName(event.target.value);
              }}
              onKeyUp={(event) => {
                handleEnterPress(event, handleGoalCreation, submitDisabled);
              }}
              required
            />
            <input
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
              name="module"
              type="text"
              placeholder="Goal Description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              onKeyUp={(event) => {
                handleEnterPress(event, handleGoalCreation, submitDisabled);
              }}
              required
            />
            <div className="w-full flex justify-center items-center">
              <p className="text-base font-headlineFont">Daily</p>
              <Checkbox />
              <p> Due Date</p>
              <DatePicker/>
            </div>
            <button
              onClick={handleGoalCreation}
              disabled={submitDisabled}
              className="w-6/12 h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </LocalizationProvider>
  );
}

export default GoalCreator;
