import React, { useState } from "react";
import "./ModuleCreate.css";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { genID } from "../../utils/rng";

function ModuleCreator({addModule}) {
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const submitDisabled = moduleName === "" || description === "";

  async function handleModuleCreation() {
    try {
      const response = await axios.post("http://localhost:4000/api/module", {name: moduleName, description, completion_percent: 0, email: "example@gmail.com"});
      console.log(response.data);
      addModule({module_id: genID(), module_name: moduleName, description: description, completion_percent: 0});
      setOpen(false);
    } catch(error) {
      console.log(error);
      alert(error.response.data);
    }
  }
  
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
          <hr/>
          <div className="creation-body">
          <input
            id="module"
            name="module"
            type="text"
            placeholder="Module Name"
            value={moduleName}
            onChange={(event) => {setModuleName(event.target.value)}}
            required
            />
          <input
            id="module"
            name="module"
            type="text"
            placeholder="Module Description"
            value={description}
            onChange={(event) => {setDescription(event.target.value)}}
            required
          />
          <button onClick={handleModuleCreation} disabled={submitDisabled}>Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModuleCreator;
