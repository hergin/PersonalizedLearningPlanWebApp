import React, { useState, useMemo } from "react";
import { Modal, TextField, Button } from "@mui/material";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useTagCreator } from "../hooks/useTags";

interface TagCreatorProps {
  accountId: number;
}

function TagCreator({ accountId }: TagCreatorProps) {
  const [tagName, setTagName] = useState("");
  const [open, setOpen] = useState(false);
  const { handleEnterPress } = useHotKeys();
  const { mutate: createTag } = useTagCreator();

  const submitDisabled = useMemo<boolean>(() => {
    return tagName === "";
  }, [tagName]);

  function handleTagCreation() {
    createTag({name: tagName, color: "#000000", accountId});
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
            <TextField
              label="Name"
              value={tagName}
              onChange={(event) => {
                setTagName(event.target.value);
              }}
              onKeyUp={(event) => {
                handleEnterPress(event, handleTagCreation, submitDisabled);
              }}
              className="w-8/12 h-10 px-2"
              required
            />
            <div className="w-full flex justify-center items-center px-20 ">
              <Button
                variant="contained"
                onClick={handleTagCreation}
                disabled={submitDisabled}
                className="w-5/12 h-10"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TagCreator;
