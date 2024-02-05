import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ApiClient } from "../hooks/ApiClient";
import { useHotKeys } from "../hooks/useHotKeys";
import { GoalEditorProps, GoalType } from "../types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function GoalEditor({
  id,
  dataName,
  dataDescription,
  dueDate,
  goalType,
}: GoalEditorProps) {
  const queryClient = useQueryClient()
  const [anchorElGoal, setAnchorElGoal] = React.useState(null);
  const open = Boolean(anchorElGoal);
  const [dataNameLocal, setDataNameLocal] = useState(dataName);
  const [dataDescriptionLocal, setDataDescriptionLocal] =
    useState(dataDescription);
  const [openModal, setOpenModal] = useState(false);
  const GoalTypes = {
    TODO: "todo",
    DAILY: "daily",
  };
  const [goalTypeNew, setGoalTypeNew] = useState(goalType as string);
  const [dueDateNew, setDueDateNew] = useState<string | undefined>(dayjs(dueDate).format("MM/DD/YYYY"));
  const handleClick = (event: any) => {
    setAnchorElGoal(event.currentTarget);
  };
  const handleOpenModal = () => {
    setDataNameLocal(dataName);
    setDataDescriptionLocal(dataDescription);
    setOpenModal(true);
    setAnchorElGoal(null); // Close the menu when the modal opens
  };
  const handleClose = () => {
    setAnchorElGoal(null);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const { put, del } = ApiClient();
  const { handleEnterPress } = useHotKeys();

  async function handleGoalEdit() {
    console.log(`ID in handleGoalEdit: ${id}`);
    console.log(dueDateNew + "dueDateNew");
    try {
      console.log(`ID in handleGoalEdit: ${id}`);
      await put(`/goal/update/${id}`, {
        name: dataNameLocal,
        description: dataDescriptionLocal,
        isComplete: false,
        dueDate: dayjs(dueDateNew).toDate().toISOString(),
        goalType: goalTypeNew,
      });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      handleCloseModal();
    } catch (error: any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  function toggleGoalType(checked: boolean) {
    if (checked) {
      setGoalTypeNew(GoalTypes.DAILY);
    } else {
      setGoalTypeNew(GoalTypes.TODO);
    }
  }

  async function handleGoalDelete() {
    try {
      const result = await del(`/goal/delete/${id}`);
      console.log(result);
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      handleClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
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
        <MenuItem key={"delete"} onClick={handleGoalDelete}>
          Delete
        </MenuItem>
      </Menu>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Edit Object</DialogTitle>
          <DialogContent>
            <TextField
              value={dataNameLocal}
              onChange={(e) => setDataNameLocal(e.target.value)}
              onKeyDown={(event) => {
                handleEnterPress(event, handleGoalEdit);
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              value={dataDescriptionLocal}
              onChange={(e) => setDataDescriptionLocal(e.target.value)}
              onKeyDown={(event) => {
                handleEnterPress(event, handleGoalEdit);
              }}
              fullWidth
              margin="normal"
            />
            <div className="w-full flex justify-between items-center px-20 ">
              <div className="flex flex-row justify-center items-center">
                <p className="font-headlineFont text-xl">Daily</p>
                <Checkbox
                  checked={goalTypeNew === "daily"}
                  onChange={(event) => toggleGoalType(event.target.checked)}
                />
              </div>
              <DatePicker
                label="Due Date"
                value={dayjs(dueDateNew)}
                onChange={(newDueDate) => setDueDateNew(dayjs(newDueDate).format("MM/DD/YYYY"))}
              />
            </div>
            <div className="flex flex-row justify-center items-center pt-10">
              <Button variant="contained" onClick={handleGoalEdit}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </LocalizationProvider>
    </>
  );
}
