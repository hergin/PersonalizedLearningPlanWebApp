import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { DatePicker } from "@mui/x-date-pickers";
import { Checkbox, InputLabel, MenuItem, Select } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoalType, CreateSubGoalProps, Tag } from "../../../types";
import { useUser } from "../../login/hooks/useUser";
import { useTags } from "../../tags/hooks/useTags";
import { useGoalCreator } from "../hooks/useGoals";

interface GoalCreatorProps {
  moduleID: number;
  parentId: number;
}

function SubGoalCreator({ moduleID, parentId }: GoalCreatorProps) {
  const [goal, setGoal] = useState<CreateSubGoalProps>({
    name: "", description: "", goalType: GoalType.TASK, isComplete: false, moduleId: moduleID, parentId
  });
  const { user } = useUser();
  const { data: tags } = useTags(user.id);
  const [open, setOpen] = useState(false);
  const submitDisabled = goal.name === "" || goal.description === "";
  const { handleEnterPress } = useHotKeys();
  const { mutateAsync: createGoal } = useGoalCreator(moduleID);
  
  async function handleGoalCreation() {
    await createGoal(goal);
    setOpen(false);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <button
          className="flex flex-row transition-transform rounded  w-full h-[50px] border-2 border-solid border-[#F4F4F4] justify-center items-center hover:scale-105"
          onClick={() => setOpen(true)}
        >
          <h1 className="text-black font-headlineFont text-lg">Add SubGoal</h1>
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
                value={goal.name}
                onChange={(event) => {
                  setGoal({...goal, name: event.target.value});
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
                value={goal.description}
                onChange={(event) => {
                  setGoal({...goal, description: event.target.value});
                }}
                onKeyUp={(event) => {
                  handleEnterPress(event, handleGoalCreation, submitDisabled);
                }}
                required
              />
              <div className="w-full flex justify-between items-center px-20 gap-4 ">
                <div className="flex flex-row justify-center items-center">
                  <p className="font-headlineFont text-xl">Daily</p>
                  <Checkbox
                    onChange={(event) => setGoal({...goal, goalType: event.target.checked ? GoalType.REPEATABLE : GoalType.TASK})}
                  />
                </div>
                <div className="flex flex-row items-center gap-2 ">
                  <InputLabel id="simple-select-label">Tag</InputLabel>
                  <Select
                    value={goal.tagId}
                    onChange={(event) => setGoal({...goal, tagId: Number(event.target.value)})}
                    sx={{
                      color: "black",
                      width: 250,
                      height: 50,
                    }}
                  >
                    {tags?.map((tag: Tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <DatePicker
                  label="Due Date"
                  value={goal.dueDate}
                  onChange={(newDueDate) => setGoal({...goal, dueDate: newDueDate})}
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

export default SubGoalCreator;
