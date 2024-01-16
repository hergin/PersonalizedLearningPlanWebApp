import React, { useState } from "react";
import "./GoalCreator.css";
import Modal from "@mui/material/Modal";
import { ApiClient } from "../../hooks/ApiClient";
import { Button } from "@mui/material";
import { Goal } from "../../types";

interface GoalCreatorProps {
  moduleID: number,
  addGoal: (goal: Goal) => void,
}

function GoalCreator({ moduleID, addGoal } : GoalCreatorProps) {
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
    } catch (error : any) {
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
      <Modal className="center" open={open} onClose={() => setOpen(false)}>
        <div className="creation-dialog">
          <div className="creation-header">
            <h1>Create a new goal</h1>
          </div>
          <hr />
          <div className="creation-body">
            <input
              className="module-name"
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
              className="module-description"
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
              className="module-create-button"
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
