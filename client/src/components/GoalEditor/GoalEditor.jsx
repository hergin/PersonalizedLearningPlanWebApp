import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { ApiClient } from "../../hooks/ApiClient";

export default function GoalEditor({
  editObject,
  dataName,
  dataDescription,
  id,
  moduleID,
  goalCompletion,
  deleteObject,
}) {
  GoalEditor.propTypes = {
    editObject: PropTypes.func,
    dataName: PropTypes.string,
    dataDescription: PropTypes.string,
    id: PropTypes.number,
    moduleID: PropTypes.string,
    goalCompletion: PropTypes.number,
    deleteObject: PropTypes.func,
  };

  const [anchorElGoal, setAnchorElGoal] = React.useState(null);
  const open = Boolean(anchorElGoal);
  const [dataNameLocal, setDataNameLocal] = useState(dataName);
  const [dataDescriptionLocal, setDataDescriptionLocal] =
    useState(dataDescription);
  const [openModal, setOpenModal] = useState(false);
  const handleClick = (event) => {
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

  async function handleGoalEdit() {
    try {
      await put(`/goal/update/${id}`, {
        id: id,
        name: dataNameLocal,
        description: dataDescriptionLocal,
        is_complete: goalCompletion,
      });
      editObject({
        name: dataNameLocal,
        description: dataDescriptionLocal,
        goal_id: id,
      });
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  async function handleGoalDelete() {
    try {
      const result = await del(`/goal/delete/${id}`);
      console.log(result);
      deleteObject(id);
      handleClose();
    } catch (error) {
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
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Object</DialogTitle>
        <DialogContent>
          <TextField
            value={dataNameLocal}
            onChange={(e) => setDataNameLocal(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            value={dataDescriptionLocal}
            onChange={(e) => setDataDescriptionLocal(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleGoalEdit}>
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
