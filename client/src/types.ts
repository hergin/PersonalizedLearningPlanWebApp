export enum GoalType {
  TASK = "todo",
  REPEATABLE = "daily",
}

export interface Module {
  id: number;
  name: string;
  description: string;
  completion: number;
}

export interface Goal {
  goal_id: number;
  name: string;
  description: string;
  goal_type: GoalType;
  is_complete: boolean;
  module_id: number;
  due_date?: string | null;
  sub_goals?: Goal[];
  tag_name?: string;
  color?: string;
  feedback?: string;
}

export interface User {
  id: number;
  accessToken: string;
  refreshToken: string;
}

export type Profile = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  jobTitle?: string;
  bio?: string;
};

export type Settings = {
  receiveEmails: boolean;
  allowCoachInvitations: boolean;
};

export type Tag = {
  id?: number;
  name: string;
  color: string;
  accountId: number;
};

export type Understudy = {
  account_id: number;
  profile_id: number;
  username: string;
  coach_id: number;
};

export interface ModuleCreatorProps {
  accountId: number;
  modalTitle: string;
  open: boolean;
  closeModal: () => void;
}

export interface LongMenuProps {
  id: number;
  moduleName: string;
  moduleDescription: string;
  moduleCompletion: number;
  editFunction: (module: Module) => void;
  deleteFunction: (id: number) => void;
}

export interface GoalStepperProps {
  moduleID: number;
  steps: Goal[];
  addGoal: (goal: Goal) => void;
  editGoal: (goal: Goal) => void;
  deleteGoal: (id: number) => void;
  restGoalProgress: () => void;
  addGoalProgress: () => void;
}

export interface GoalHeaderProps {
  moduleID: string;
}

export interface CreateProfileProps {
  username: string;
  firstName: string;
  lastName: string;
  account_id: number;
}
export interface CreateInvitationProps {
  senderId: number;
  recipientId: string;
}

export interface CreateModuleProps {
  module_name: string;
  description: string;
  account_id: number;
}

export interface CreateGoalProps {
  name: string;
  description: string;
  goalType: GoalType;
  isComplete: boolean;
  moduleId: number;
  dueDate?: string | null;
  tagId?: number | null;
}

export interface CreateSubGoalProps extends CreateGoalProps {
  parentId: number;
}

export interface UpdateFeedbackProps {
  goal_id: number;
  feedback: string;
}

export const emptyUser: User = { id: -1, accessToken: "", refreshToken: "" };
export const emptyProfile: Profile = {
  id: -1,
  username: "",
  firstName: "",
  lastName: "",
  profilePicture: "",
  jobTitle: "",
  bio: "",
};
export const defaultSettings = {
  receiveEmails: true,
  allowCoachInvitations: true,
};
