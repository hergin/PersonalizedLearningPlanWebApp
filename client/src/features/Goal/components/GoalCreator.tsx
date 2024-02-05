import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { ApiClient } from "../../../hooks/ApiClient";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { DatePicker } from "@mui/x-date-pickers";
import { Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";

interface GoalCreatorProps {
  moduleID: string;
  height?: string;
  goalID?: string;
}

function GoalCreator({ moduleID, goalID, height }: GoalCreatorProps) {
  const [goalName, setGoalName] = useState("");
  const [description, setDescription] = useState("");
  const GoalTypes = {
    TODO: "todo",
    DAILY: "daily",
  };
  const [goalType, setGoalType] = useState(GoalTypes.TODO);
  const queryClient = useQueryClient();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const submitDisabled = goalName === "" || description === "";
  const { post } = ApiClient();
  const { handleEnterPress } = useHotKeys();

  async function handleGoalCreation() {
    try {
      await post("/goal/add", {
        name: goalName,
        description: description,
        goalType: goalType,
        isComplete: false,
        moduleId: moduleID,
        dueDate: dueDate,
        parentGoal: goalID,
      });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      console.log("Goal creation is not implemented yet.");
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }
  function changeType(checked: boolean) {
    if (checked) {
      setGoalType(GoalTypes.DAILY);
    } else {
      setGoalType(GoalTypes.TODO);
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
                className="h-40 rounded text-base w-full border border-solid border-gray-300 px-2 "
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
              <div className="w-full flex justify-between items-center px-20 ">
                <div className="flex flex-row justify-center items-center">
                  <p className="font-headlineFont text-xl">Daily</p>
                  <Checkbox
                    onChange={(event) => changeType(event.target.checked)}
                  />
                </div>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newDueDate) => setDueDate(newDueDate)}
                />
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
