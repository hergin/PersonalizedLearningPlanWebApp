import React from "react";
import "./ModuleCreate.css";
import Modal from "@mui/material/Modal";

function ModuleCreator(addModule) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="divAdd">
      <button onClick={() => setOpen(true)} className="fill-div">
        <h1>+</h1>
      </button>
      <Modal className="center" open={open} onClose={() => setOpen(false)}>
        <div className="creation-dialog">
          <div className="creation-header">
            <h1>Create a new module</h1>
          </div>
          <div className="creation-body">
          <input
            id="module"
            name="module"
            type="text"
            placeholder="Module Name"
            required
          />
          <button onClick={() => console.log("Module Created")}>Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModuleCreator;
