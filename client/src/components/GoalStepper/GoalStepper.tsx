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
import GoalCreator from "../GoalCreator/GoalCreator";
import GoalEditor from "../GoalEditor/GoalEditor";
import { Goal } from "../../types";

interface GoalStepperProps {
  moduleID: number,
  steps: Goal[],
  addGoal: (goal: Goal) => void,
  editGoal: (goal: Goal) => void,
  deleteGoal: (id : number) => void,
  restGoalProgress: () => void,
  addGoalProgress: () => void,
}

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
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    addGoalProgress();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    restGoalProgress();
  };

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
                        moduleID={step.module_id}
                        goalCompletion={step.is_complete}
                        deleteObject={deleteGoal}
                      />
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1, fontSize: "1rem" }}
                      >
                        {index === steps.length - 1 ? "Finish" : "Complete"}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
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
