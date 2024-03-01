import React from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";




const SearchBar = () => (
  <>
    <TextField
      id="search-bar"
      className="text"
      label="Enter a user name"
      variant="outlined"
      placeholder="Search..."
      size="medium"
      sx={{
        backgroundColor: "white",
      }}
      fullWidth
      color="primary"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "black" }} />
    </IconButton>
  </>
);

export default SearchBar;
