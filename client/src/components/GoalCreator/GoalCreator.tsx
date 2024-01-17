import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { ApiClient } from "../../hooks/ApiClient";
import { Button } from "@mui/material";
import { Goal } from "../../types";

interface GoalCreatorProps {
  moduleID: number;
  addGoal: (goal: Goal) => void;
}

function GoalCreator({ moduleID, addGoal }: GoalCreatorProps) {
  const [goalName, setGoalName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const submitDisabled = goalName === "" || description === "";
  const { post } = ApiClient();

  async function handleModuleCreation() {
    try {
      const response = await post("/goal/add", {
        name: goalName,
        description: description,
        is_complete: false,
        module_id: moduleID,
      });
      console.log(response[0].goal_id);
      addGoal({
        id: response[0].goal_id,
        name: goalName,
        description: description,
        is_complete: false,
        module_id: moduleID,
      });
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mt: 1, mr: 1, fontSize: "1rem" }}
      >
        Create a new Goal
      </Button>
      <Modal
        className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="bg-white w-2/5 flex flex-col items-center justify-start border border-black border-solid h-1/3 p-4">
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
              required
            />
            <button
              onClick={handleModuleCreation}
              disabled={submitDisabled}
              className="w-6/12 h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GoalCreator;
