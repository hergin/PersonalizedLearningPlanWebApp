import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { ApiClient } from "../../../hooks/ApiClient";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useQueryClient } from "@tanstack/react-query";
import { MuiColorInput } from "mui-color-input";
import { Button } from "@mui/material";
import { useUser } from "../../login/hooks/useUser";

function TagCreator() {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const submitDisabled = tagName === "" || tagColor === "";
  const { post } = ApiClient();
  const { handleEnterPress } = useHotKeys();
  const user = useUser();

  function handleTagCreation() {
    try {
      post("/tag/add", {
        accountId: user.user.id,
        name: tagName,
        color: tagColor,
      });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      console.log("Tag created");
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
    setOpen(false);
  }

  return (
      <div>
      <button
        onClick={() => setOpen(true)}
        className="w-auto h-auto border-1 border-solid border-gray-300 rounded p-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer"
      >
        Create New Tag
      </button>
        <Modal
          className="absolute float-left flex items-center justify-center top-2/4 left-2/4 w "
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
            <div className="w-full flex justify-center">
              <h1 className="font-headlineFont text-5xl">Create a new Tag</h1>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-10">
              <input
                className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
                name="module"
                type="text"
                placeholder="Tag Name"
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
              <div className="w-full flex justify-center items-center px-20 ">
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
