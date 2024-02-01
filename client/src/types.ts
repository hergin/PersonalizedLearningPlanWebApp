export type GoalType = "todo" | "daily";

export interface Module {
  module_id: number,
  module_name: string,
  description: string,
  completion_percent: number,
}

export interface Goal {
  goal_id: number,
  name: string,
  due_date?: Date,
  description: string,
  goalType: GoalType,
  is_complete: boolean,
  moduleId?: number
  sub_goals?: Goal[]
}

export interface User {
  email: string,
  accessToken: string,
  refreshToken: string,
}

export type Profile = {
  id : number, 
  username : string, 
  firstName : string, 
  lastName : string, 
  profilePicture : string, 
  jobTitle? : string, 
  bio? : string
}

export interface ModuleCreatorProps {
  addModule: ({ module_id, module_name, description, completion_percent }: Module) => void,
  closeModal: () => void,
  modalTitle: string;
  open: boolean;

}

export interface LongMenuProps {
  editObject: (module: Module) => void,
  dataName: string,
  dataDescription: string,
  id: number,
  moduleCompletion: number,
  deleteObject: (id: number) => void
}

export interface GoalStepperProps {
  moduleID: number,
  steps: Goal[],
  addGoal: (goal: Goal) => void,
  editGoal: (goal: Goal) => void,
  deleteGoal: (id: number) => void,
  restGoalProgress: () => void,
  addGoalProgress: () => void,
}

export interface GoalHeaderProps {
  moduleID: string
}

export interface GoalEditorProps {
  id: number,
  dataName: string,
  dataDescription: string,
  dueDate?: Date,
  goalType: "todo" | "daily",
}

export interface GoalCreatorProps {
  moduleID: string;
  addGoal: (goal: Goal) => void;
}

export const emptyUser: User = { email: "", accessToken: "", refreshToken: "" };
export const emptyProfile : Profile = { id: -1, username: "", firstName: "", lastName: "", profilePicture: "", jobTitle: "", bio: ""};

