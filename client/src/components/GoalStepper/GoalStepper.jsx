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
import "./GoalStepper.css";
import PropTypes from "prop-types";
import GoalCreator from "../GoalCreator/GoalCreator";
import GoalEditor from "../GoalEditor/GoalEditor";

export default function GoalStepper({
  deleteGoal,
  editGoal,
  restGoalProgress,
  addGoalProgress,
  steps,
  addGoal,
  moduleID,
}) {
  GoalStepper.propTypes = {
    deleteGoal: PropTypes.func,
    editGoal: PropTypes.func,
    restGoalProgress: PropTypes.func,
    addGoalProgress: PropTypes.func,
    steps: PropTypes.array,
    addGoal: PropTypes.func,
    moduleID: PropTypes.string,
  };
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
        <div className="no-goals-div">
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
                <div className="step-content">
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
                        id={step.goal_id}
                        moduleID={moduleID}
                        goalCompletion={step.completion_percent}
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
