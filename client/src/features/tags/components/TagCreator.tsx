import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { ApiClient } from "../../../hooks/ApiClient";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useQueryClient } from "@tanstack/react-query";
import { MuiColorInput } from "mui-color-input";

function TagCreator() {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const submitDisabled = tagName === "" || tagColor === "";
  const { post } = ApiClient();
  const { handleEnterPress } = useHotKeys();

  function handleTagCreation() {
    console.log("Tag creation is not implemented yet.");
    setOpen(false);
  }

  return (
      <div>

        <Modal
          className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
            <div className="w-full flex justify-center">
              <h1 className="font-headlineFont text-5xl">Create a new goal</h1>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-10">
              <input
                className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
                name="module"
                type="text"
                placeholder="Goal Name"
                value={tagName}
                onChange={(event) => {
                  setTagName(event.target.value);
                }}
                onKeyUp={(event) => {
                  handleEnterPress(event, handleTagCreation, submitDisabled);
                }}
                required
              />
              <MuiColorInput
                format="hex"
                value={tagColor}
                onChange={setTagColor}
              />
              <div className="w-full flex justify-between items-center px-20 ">
                <div className="flex flex-row justify-center items-center">
                  <p className="font-headlineFont text-xl">Daily</p>
                </div>
                <button
                  onClick={handleTagCreation}
                  disabled={submitDisabled}
                  className="w-6/12 h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
  );
}

export default TagCreator;
