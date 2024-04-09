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
import { useApiConnection } from "../../../hooks/useApiConnection";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { LongMenuProps } from "../../../types";

const ModuleEditorButton = ({
  id: module_id,
  moduleName,
  moduleDescription,
  moduleCompletion,
  editFunction,
  deleteFunction
}: LongMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [newModuleName, seNewModuleName] = useState(moduleName);
  const [newDescription, setNewDescription] =
    useState(moduleDescription);
  const [openModal, setOpenModal] = useState(false);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpenModal = () => {
    seNewModuleName(moduleName);
    setNewDescription(moduleDescription);
    setOpenModal(true);
    setAnchorEl(null); // Close the menu when the modal opens
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const { del } = useApiConnection();
  const { handleEnterPress } = useHotKeys();

  async function handleModuleEdit() {
    editFunction({
      id: module_id,
      name: newModuleName,
      description: newDescription,
      completion: moduleCompletion,
    });
    handleCloseModal();
  }

  async function handleModuleDelete() {
    deleteFunction(module_id);
    handleCloseModal();
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
        sx={{ color: "white" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem key={"edit"} onClick={handleOpenModal}>
          Edit
        </MenuItem>
        <MenuItem key={"delete"} onClick={handleModuleDelete}>
          Delete
        </MenuItem>
      </Menu>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Object</DialogTitle>
        <DialogContent>
          <TextField
            value={newModuleName}
            onChange={(e) => seNewModuleName(e.target.value)}
            onKeyDown={(event) => {
              handleEnterPress(event, handleModuleEdit);
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(event) => {
              handleEnterPress(event, handleModuleEdit);
            }}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleModuleEdit}>
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModuleEditorButton;
