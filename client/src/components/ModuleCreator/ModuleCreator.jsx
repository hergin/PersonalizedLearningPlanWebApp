
import "./ModuleCreate.css";


function ModuleCreator() {
  return (
    <div className="divAdd">
      <button onClick={() => console.log("Open Modal")} className="fill-div">
        <h1>+</h1>
      </button>
    </div>
  );
}

export default ModuleCreator;
