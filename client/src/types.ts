export enum GoalType {
  TASK = "todo",
  REPEATABLE = "daily",
}

export interface Module {
  id: number,
  name: string,
  description: string,
  completion: number,
}

export interface Goal {
  goal_id: number,
  name: string,
  due_date?: string,
  description: string,
  goal_type: GoalType,
  is_complete: boolean,
  moduleId?: number
  sub_goals?: Goal[]
  tag_name?: string
  color?: string
  feedback?: string
}

export interface User {
  id: number,
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

export type Settings = {
  receiveEmails: boolean,
  allowCoachInvitations: boolean
}

export interface ModuleCreatorProps {
  closeModal: () => void,
  modalTitle: string;
  open: boolean;

}

export interface LongMenuProps {
  id: number,
  moduleName: string,
  moduleDescription: string,
  moduleCompletion: number,
  editFunction: (module: Module) => void,
  deleteFunction: (id: number) => void
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
  dueDate?: string,
  goalType: "todo" | "daily",
}

export interface GoalCreatorProps {
  moduleID: string;
  addGoal: (goal: Goal) => void;
}

export interface CreateProfileProps {
  username : string, 
  firstName : string, 
  lastName : string, 
  account_id: number
}

export interface CreateModuleProps {
  module_name: string,
  description: string,
  account_id: number
}

export const emptyUser: User = { id: -1, accessToken: "", refreshToken: "" };
export const emptyProfile : Profile = { id: -1, username: "", firstName: "", lastName: "", profilePicture: "", jobTitle: "", bio: ""};
export const defaultSettings = {receiveEmails: true, allowCoachInvitations: true};
