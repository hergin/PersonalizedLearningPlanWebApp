import React, { useState, useMemo } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ModuleLongMenuProps {
  onEditPress: () => void,
  onDeletionPress: () => void,
}

export default function ModuleLongMenu({onEditPress, onDeletionPress}: ModuleLongMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
  const isMenuOpen = useMemo<boolean>(() => {
    return Boolean(anchorEl);
  }, [anchorEl]);

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={isMenuOpen ? "long-menu" : undefined}
        aria-expanded={isMenuOpen ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event: any) => {setAnchorEl(event.currentTarget)}}
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
        open={isMenuOpen}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem key={"edit"} onClick={onEditPress}>
          Edit
        </MenuItem>
        <MenuItem key={"delete"} onClick={onDeletionPress}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
