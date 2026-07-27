import type { ApiResponse } from "./api.type";
import type { TMeta } from "./global.type";
import type { LearningModule } from "./module.type";

export type TrainingStatus = "draft" | "published" | string;
export type TrainingAuthType = "passcode" | "email" | "employeeId" | "guest";

export type TrainingCreator = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
};

export type TrainingCompany = {
  _id: string;
  firstName: string;
  email: string;
  slug?: string;
  image?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    videoTitle?: string;
    videoDescription?: string;
    presenterName?: string;
    presenterDesignation?: string;
    videoUrl?: string;
    logo?: string;
  };
};

export type TrainingModuleSummary = Pick<
  LearningModule,
  "_id" | "title" | "description" | "status"
> & {
  thumbnailImage?: string;
  totalQuestions?: number;
  questions?: LearningModule["questions"];
  userProgress?: {
    status: "not_started" | "in_progress" | "completed" | string;
    progressPercentage: number;
    score: number;
    completedQuestions: number;
    totalQuestions: number;
  };
};

export type Training = {
  _id: string;
  title: string;
  description?: string;
  thumbnailImage?: string;
  companyId?: string | TrainingCompany | null;
  teamId?: string;
  status: TrainingStatus;
  authType?: TrainingAuthType;
  passcode?: string;
  qrCodeUrl?: string;
  isDeleted?: boolean;
  createdBy?: string | TrainingCreator | null;
  topics?: Topic[];
  topicCount?: number;
  totalModules?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type Topic = {
  _id: string;
  title: string;
  description?: string;
  trainingId?: string;
  moduleIds?: string[] | TrainingModuleSummary[];
  modules?: TrainingModuleSummary[];
  moduleCount?: number;
  order?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type TrainingListResponse = ApiResponse<Training[]> & {
  meta?: TMeta;
};

export type TrainingData = {
  title: string;
  description?: string;
  status?: TrainingStatus;
  authType?: TrainingAuthType;
  passcode?: string;
  companyId?: string;
  teamId?: string;
};

export type CreateTrainingPayload = {
  data: TrainingData;
  thumbnailImage?: Blob;
};

export type UpdateTrainingPayload = Partial<TrainingData> & {
  thumbnailImage?: Blob;
};

export type AssignTrainingPayload = {
  companyId: string;
  teamId?: string;
};

export type DuplicateTrainingPayload = {
  newTitle: string;
};

export type TopicData = {
  title: string;
  description?: string;
};

export type AddModuleToTopicPayload = {
  moduleIds: string[];
};

export type ReorderTopicsPayload = {
  topicIds: string[];
};

export type GenerateTrainingLinkPayload = {
  expiresInDays?: number;
};

export type SendTrainingInvitePayload = {
  email: string;
};

export type TrainingAuthenticatePayload =
  | {
      authType: Exclude<TrainingAuthType, "guest">;
      identifier: string;
    }
  | {
      authType: "guest";
      name: string;
    };

export type TrainingInviteLink = {
  token?: string;
  inviteToken?: string;
  link?: string;
  trainingLink?: string;
  shareLink?: string;
  url?: string;
  expiresAt?: string;
  trainingTitle?: string;
};

export type TrainingAuthData = {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    guestId?: string;
    [key: string]: unknown;
  };
  training?: UserTrainingView;
  [key: string]: unknown;
};

export type UserTrainingView = Training & {
  progressPercentage?: number;
  completedModules?: number;
  totalModules?: number;
};






