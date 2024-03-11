import React from "react";
import TextField from "@mui/material/TextField";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({searchQuery, setSearchQuery}: SearchBarProps) => {
  return (
    <>
      <TextField
        id="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
    </>
  );
};

export default SearchBar;
