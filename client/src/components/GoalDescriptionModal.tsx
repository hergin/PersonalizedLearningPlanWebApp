import React from "react";
import { Modal } from "@mui/material";

interface Props {
  goal: {
    name: string;
    description: string;
  };
  onClose: () => void;
  open: boolean;
}

const GoalDescriptionModal = ({ goal, onClose, open }: Props) => {
  return (
    <Modal
      className="absolute float-left flex items-center justify-center top-2/4 left-2/4"
      open={open}
      onClose={onClose}
    >
      <div className="bg-white h-auto w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
        <div>
          <h1 className="font-headlineFont text-5xl">{goal.name}</h1>
        </div>

        <div className="bg-[#F1F1F1] w-full h-auto rounded border border-solid border-[lightgrey] p-1 ">
        
          <p>{goal.description}</p>
        </div>
      </div>
    </Modal>
  );
};

export default GoalDescriptionModal;
