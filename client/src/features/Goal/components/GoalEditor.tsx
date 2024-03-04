import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Menu,
  MenuItem,
  IconButton
} from "@mui/material";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { Goal, GoalType } from "../../../types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useGoalUpdater, useGoalRemover } from "../hooks/useGoals";

interface GoalEditorProps {
  goal: Goal,
}

export default function GoalEditor({goal}: GoalEditorProps) {
  const [anchorElGoal, setAnchorElGoal] = useState<Element | null>(null);
  const [updatedGoal, setGoal] = useState<Goal>(goal);
  const [openModal, setOpenModal] = useState(false);
  const { mutateAsync: updateGoal } = useGoalUpdater(goal.module_id);
  const { mutateAsync: deleteGoal } = useGoalRemover(goal.module_id);
  const { handleEnterPress } = useHotKeys();
  const open = Boolean(anchorElGoal);

  const handleOpenModal = () => {
    setOpenModal(true);
    setAnchorElGoal(null); // Close the menu when the modal opens
  };

  const handleClose = () => {
    setAnchorElGoal(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  async function handleUpdateGoal() {
    await updateGoal(updatedGoal);
    handleCloseModal();
  }

  async function handleDeleteGoal() {
    await deleteGoal(goal.goal_id);
    handleClose();
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event) => setAnchorElGoal(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorElGoal}
        open={open}
        onClose={handleClose}
      >
        <MenuItem key={"edit"} onClick={handleOpenModal}>
          Edit
        </MenuItem>
        <MenuItem key={"delete"} onClick={handleDeleteGoal}>
          Delete
        </MenuItem>
      </Menu>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Edit Object</DialogTitle>
          <DialogContent>
            <TextField
              value={updatedGoal.name}
              onChange={(e) => setGoal({...updatedGoal, name: e.target.value})}
              onKeyDown={(event) => {
                handleEnterPress(event, handleUpdateGoal);
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              value={updatedGoal.description}
              onChange={(e) => setGoal({...updatedGoal, description: e.target.value})}
              onKeyDown={(event) => {
                handleEnterPress(event, handleUpdateGoal);
              }}
              fullWidth
              multiline={true}
              margin="normal"
            />
            <div className="w-full flex justify-between items-center px-20 ">
              <div className="flex flex-row justify-center items-center">
                <p className="font-headlineFont text-xl">Daily</p>
                <Checkbox
                  checked={updatedGoal.goal_type === GoalType.REPEATABLE}
                  onChange={(event) => setGoal({...goal, goal_type: event.target.checked ? GoalType.REPEATABLE : GoalType.TASK})}
                />
              </div>
              <DatePicker
                label="Due Date"
                value={dayjs(updatedGoal.due_date)}
                onChange={(newDueDate) =>
                  setGoal({...updatedGoal, due_date: dayjs(newDueDate).format("MM/DD/YYYY")})
                }
              />
            </div>
            <div className="flex flex-row justify-center items-center pt-10">
              <Button variant="contained" onClick={handleUpdateGoal}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </LocalizationProvider>
    </>
  );
}
