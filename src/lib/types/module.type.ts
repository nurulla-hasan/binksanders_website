import type { ApiResponse } from "./api.type";
import type { TMeta } from "./global.type";

export type ModuleQuestionType =
  | "MCQ"
  | "Swipe"
  | "Ordering"
  | "Chat Scenario"
  | "Video"
  | "Rating";

export type ModuleMessage = {
  sender: string;
  text: string;
};

export type ModuleQuestion = {
  id: string;
  type: ModuleQuestionType;
  content: string;
  isScored: boolean;
  explanation?: string;
  options?: string[];
  correctAnswer?: string;
  leftLabel?: string;
  rightLabel?: string;
  correctDirection?: "left" | "right";
  items?: string[];
  messages?: ModuleMessage[];
  videoUrl?: string;
  scale?: number;
};

export type ModuleCreator = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ModuleTeam = {
  _id: string;
  name: string;
};

export type LearningModule = {
  _id: string;
  title: string;
  description: string;
  thumbnailImage: string;
  questions: ModuleQuestion[];
  status: "draft" | "published" | string;
  createdBy: ModuleCreator;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  teamId?: ModuleTeam;
};

export type ModuleListResponse = ApiResponse<LearningModule[]> & {
  meta: TMeta;
};

export type ModuleData = {
  title: string;
  description: string;
  questions: ModuleQuestion[];
};

export type CreateModulePayload = {
  data: ModuleData;
  thumbnailImage: Blob;
};

export type UpdateModulePayload = Partial<ModuleData>;

export type DuplicateModulePayload = {
  title: string;
};

export type AssignModulesPayload = {
  moduleIds: string[];
  companyId: string;
  teamId: string;
};
