import "./Goals.css";
import { useParams } from "react-router-dom";
import GoalHeader from "../../components/GoalHeader/GoalHeader";

const Goals = () => {
  const { id } = useParams();
  return (
    <div className="goal-screen">
      <GoalHeader moduleID={id} />
      <h1>{id}</h1>
    </div>
  );
};

export default Goals;
