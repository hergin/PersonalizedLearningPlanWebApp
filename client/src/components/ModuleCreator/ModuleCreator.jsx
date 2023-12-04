import React, { useState } from "react";
import "./ModuleCreate.css";
import Modal from "@mui/material/Modal";
import { useUser } from "../../hooks/useUser";
import { ApiClient } from "../../hooks/ApiClient";

function ModuleCreator({addModule}) {
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const submitDisabled = moduleName === "" || description === "";
  const { user } = useUser();
  const { post } = ApiClient();
  
  async function handleModuleCreation() {
    try {
      const response = await post("/module/add", {name: moduleName, description, completion_percent: 0, email: user.email});
      console.log(response);
      const moduleID = response.module_id;
      addModule({module_id: moduleID, module_name: moduleName, description: description, completion_percent: 0});
      setOpen(false);
    } catch(error) {
      console.error(error);
      alert((error.message) ? error.message : error);
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
