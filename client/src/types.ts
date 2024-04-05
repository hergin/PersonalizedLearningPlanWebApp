export enum GoalType {
  TASK = "todo",
  REPEATABLE = "daily",
}

const roles = {
  ADMIN: "admin",
  COACH: "coach",
  BASIC: "basic", 
} as const;
export type Role = (typeof roles)[keyof typeof roles];

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
  role: Role;
  accessToken: string;
  refreshToken: string;
}

export type Profile = {
  [key: string]: number | string;
  id: number,
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  jobTitle: string;
  bio: string;
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

export type CreatedMessage = {
  content: string,
  sender_id: number,
  recipient_id: number
};

export type Message = CreatedMessage & {
  id: number,
  date: string,
  last_edited: string,
  username: string,
  profile_picture: string,
};

export type Chat = {
  sentMessages: Message[],
  recipientMessages: Message[],
}

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
  recipientId: number;
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

export interface LoginProps {
  email: string,
  password: string
}

export interface RegisterProps {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string
}

export const emptyUser: User = { id: -1, role: "basic", accessToken: "", refreshToken: "" };
export const defaultSettings = {
  receiveEmails: true,
  allowCoachInvitations: true,
};
