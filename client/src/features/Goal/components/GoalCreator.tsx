import React, { ReactElement, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { DatePicker } from "@mui/x-date-pickers";
import { InputLabel, MenuItem, Select, TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CreateGoalProps, CreateSubGoalProps, GOAL_TYPE, Tag } from "../../../types";
import { useTags } from "../../tags/hooks/useTags";
import { useUser } from "../../login/hooks/useUser";
import { useGoalCreator } from "../hooks/useGoals";
import { isGoalType, isCreatedSubGoal } from "../../../utils/typePredicates";

interface GoalCreatorProps {
  moduleId: number,
  parentGoalId?: number
}

function GoalCreator({ moduleId, parentGoalId }: GoalCreatorProps) {
  const [goal, setGoal] = useState<CreateGoalProps | CreateSubGoalProps>({
    name: "", description: "", goalType: GOAL_TYPE.ONCE, isComplete: false, moduleId: moduleId, parentId: parentGoalId
  });
  const { user } = useUser();
  const { data: tags } = useTags(user.id);
  const [open, setOpen] = useState(false);
  const { handleEnterPress } = useHotKeys();
  const { mutateAsync: createGoal } = useGoalCreator(moduleId);

  const goalTypeElements: ReactElement[] = useMemo<ReactElement[]>(() => {
    const result: ReactElement[] = [];
    for(const [key, value] of Object.entries(GOAL_TYPE)) {
      result.push(
        <MenuItem key={`ID-${key}`} value={value}>
          {`${key.charAt(0)}${key.slice(1).toLowerCase()}`}
        </MenuItem>
      );
    }
    return result;
  }, []);

  const submitDisabled: boolean = useMemo<boolean>(() => {
    return goal.name === "" || goal.description === "";
  }, [goal]);

  const addButton = useMemo<ReactElement>(() => {
    const isSubGoal = isCreatedSubGoal(goal);
    const style = {
      height: isSubGoal ? "h-[50px]" : "h-[100px]",
      text: isSubGoal ? "text-lg" : "text-4xl",
      borderColor: isSubGoal ? "border-[#F4F4F4]" : "border-black"
    }
    
    return (
      <button
        className={`flex flex-row transition-transform rounded w-full ${style.height} border-2 border-solid ${style.borderColor} justify-center items-center hover:scale-105`}
        onClick={() => setOpen(true)}
      >
        <h1 className={`text-black font-headlineFont ${style.text}`}>{isSubGoal ? "Add Sub Goal" : "Add Goal"}</h1>
      </button>
    );
  }, [goal]);
  
  async function handleCreation() {
    await createGoal(goal);
    setOpen(false);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        {addButton}
        <Modal
          className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-6 gap-5">
            <div className="w-full flex justify-center">
              <h1 className="font-headlineFont text-5xl">Create a Goal</h1>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-10">
              <TextField
                label="Name"
                value={goal.name}
                error={goal.name === ""}
                className="h-10"
                onChange={(event) => {
                  setGoal({...goal, name: event.target.value});
                }}
                onKeyUp={(event) => {
                  handleEnterPress(event, handleCreation, submitDisabled);
                }}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={goal.description}
                error={goal.description === ""}
                onChange={(event) => {
                  setGoal({...goal, description: event.target.value});
                }}
                onKeyUp={(event) => {
                  handleEnterPress(event, handleCreation, submitDisabled);
                }}
                multiline
                fullWidth
                required
                {...{rows: 6}}
              />
              <div className="w-full flex flex-row justify-between items-center px-20 gap-6">
                <div className="flex flex-col items-center w-4/12">
                  <InputLabel id="simple-select-label">Goal Frequency</InputLabel>
                  <Select 
                    value={goal.goalType}
                    onChange={(event) => {
                      const selectedType = event.target.value;
                      if(isGoalType(selectedType)) {
                        setGoal({...goal, goalType: selectedType});
                      }
                    }}
                    fullWidth
                  >
                    {goalTypeElements}
                  </Select>
                </div>
                <div className="flex flex-col items-center w-4/12">
                  <InputLabel id="simple-select-label">Tag</InputLabel>
                  <Select
                    value={goal.tagId}
                    onChange={(event) => {setGoal({...goal, tagId: Number(event.target.value)})}}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {tags?.map((tag: Tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col items-center w-6/12">
                  <InputLabel id="simple-select-label">Due Date</InputLabel>
                  <DatePicker
                    value={goal.dueDate}
                    onChange={(newDueDate) => setGoal({...goal, dueDate: newDueDate})}
                  />
                </div>
              </div>
              <Button
                variant="contained"
                onClick={handleCreation}
                disabled={submitDisabled}
                className="w-6/12 h-10"
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  );
}

export default GoalCreator;
