import React from "react";
import {
  Box,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import GoalCreator from "./GoalCreator";
import GoalEditor from "./GoalEditor";
import { GoalStepperProps, Goal } from "../types";
import { ApiClient } from "../hooks/ApiClient";

export default function GoalStepper({
  deleteGoal,
  editGoal,
  restGoalProgress,
  addGoalProgress,
  steps,
  addGoal,
  moduleID,
} : GoalStepperProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const { put } = ApiClient();
  
  const handleNext = async () => {
    const step = steps.at(activeStep);
    if(step) {
      step.isComplete = true;
      await updateDatabase(step);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    addGoalProgress();
  };

  const handleBack = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const step = steps.at(activeStep);
    if(step) {
      step.isComplete = false;
      await updateDatabase(step);
    }
    restGoalProgress();
  };

  async function updateDatabase(goal: Goal) {
    try {
      console.log(`${goal.id}`);
      await put(`/goal/update/${goal.id}`, {name: goal.name, description: goal.description, is_complete: goal.isComplete, moduleId: goal.moduleId});
    } catch(error: any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  return (
    <div>
      {steps.length === 0 ? (
        <div className="flex flex-col justify-center items-center w-full h-1/2">
          <GoalCreator addGoal={addGoal} moduleID={moduleID} />
        </div>
      ) : (
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{ width: 1, display: "flex" }}
        >
          {steps.map((step, index) => (
            <Step key={step.id} sx={{}}>
              <StepLabel sx={{ fontSize: "1.2rem" }}>{step.name}</StepLabel>

              <StepContent>
                <div className="flex flex-row justify-between items-center rounded text-black p-5 shadow-md">
                  <Typography
                    sx={{ fontSize: "1.2rem", fontFamily: "var(--bodyFont)" }}
                  >
                    {step.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <GoalEditor
                        editObject={editGoal}
                        dataName={step.name}
                        dataDescription={step.description}
                        id={step.id}
                        moduleID={step.moduleId}
                        goalCompletion={step.isComplete}
                        deleteObject={deleteGoal}
                      />
                      <Button
                        variant="contained"
                        onClick={async () => {await handleNext()}}
                        sx={{ mt: 1, mr: 1, fontSize: "1rem" }}
                      >
                        {index === steps.length - 1 ? "Finish" : "Complete"}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={async () => {await handleBack()}}
                        sx={{ mt: 1, mr: 1, fontSize: "1rem" }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </div>
              </StepContent>
            </Step>
          ))}
          <Step key={"stepcreate"} sx={{}} active={true}>
            <Box sx={{ mb: 2, marginLeft: "1%" }}>
              <div>
                <GoalCreator addGoal={addGoal} moduleID={moduleID} />
              </div>
            </Box>
          </Step>
        </Stepper>
      )}
    </div>
  );
}
