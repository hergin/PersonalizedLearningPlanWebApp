export interface Module {
  id: number,
  name: string,
  description: string,
  completion: number,
}

export interface Goal {
  id: number,
  name: string,
  description: string,
  is_complete: boolean,
  module_id: number
}

export interface User {
  email: string,
  accessToken: string,
  refreshToken: string,
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
  moduleID: number
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
