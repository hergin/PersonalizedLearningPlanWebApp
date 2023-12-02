import GoalHeader from "../../components/GoalHeader/GoalHeader";
import "./Goals.css";
import { useParams } from "react-router-dom";

const Goals = () => {
  const moduleID = useParams();
  return (
    <div className="goal-screen">
      <GoalHeader moduleID={moduleID} />
    </div>
  );
};

export default Goals;
