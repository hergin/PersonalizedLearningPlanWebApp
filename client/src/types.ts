export type GoalType = "todo" | "daily";

export interface Module {
  id: number,
  name: string,
  description: string,
  completion: number,
}

// TODO: We need to add due date as an optional Date and goal type to determine the goal's type.
export interface Goal {
    id: number,
    name: string,
    description: string,
    isComplete: boolean,
    moduleId: number
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
  addModule: ({ id, name, description, completion }: Module) => void,
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
  goalCompletion: boolean,
  moduleID: number,
  editObject: (goal: Goal) => void,
  deleteObject: (id: number) => void
}

export interface GoalCreatorProps {
  moduleID: number;
  addGoal: (goal: Goal) => void;
}

export const emptyUser: User = { email: "", accessToken: "", refreshToken: "" };
export const emptyProfile : Profile = { id: -1, username: "", firstName: "", lastName: "", profilePicture: "", jobTitle: "", bio: ""};

