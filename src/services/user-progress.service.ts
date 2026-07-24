"use server";

import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  LearningPathData,
  SubmitModuleAnswerPayload,
  SubmitModuleAnswerResult,
  UserModuleDetails,
} from "@/lib/types/module.type";

export const getMyLearningPath = async () =>
  nextServerFetch<ApiResponse<LearningPathData>>(
    "/user-progress/my-learning-path",
    { cache:"no-store", },
  );

export const getUserModule = async (moduleId: string) =>
  nextServerFetch<ApiResponse<UserModuleDetails>>(
    `/user-progress/module/${moduleId}`,
    { cache:"no-store", },
  );

export const submitModuleAnswer = async (
  payload: SubmitModuleAnswerPayload,
) =>
  nextServerFetch<ApiResponse<SubmitModuleAnswerResult>>(
    "/user-progress/submit-answer",
    {
      method: "POST",
      body: payload,
    },
  );
