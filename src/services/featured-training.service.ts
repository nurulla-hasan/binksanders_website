"use server";

import { updateTag } from "next/cache";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  CreateFeaturedTrainingPayload,
  FeaturedTraining,
} from "@/lib/types/training.type";

const FEATURED_TRAININGS_TAG = "featured-trainings";

export const getFeaturedTrainings = async () =>
  nextServerFetch<ApiResponse<FeaturedTraining[]>>("/featured-training", {
    cache: "no-store",
  });

export const createFeaturedTraining = async (
  payload: CreateFeaturedTrainingPayload,
) => {
  const response = await nextServerFetch<ApiResponse<FeaturedTraining>>(
    "/featured-training",
    {
      method: "POST",
      body: payload,
    },
  );

  if (response.success) updateTag(FEATURED_TRAININGS_TAG);
  return response;
};

export const removeFeaturedTraining = async (featuredTrainingId: string) => {
  const response = await nextServerFetch<ApiResponse<unknown>>(
    `/featured-training/${featuredTrainingId}`,
    { method: "DELETE" },
  );

  if (response.success) updateTag(FEATURED_TRAININGS_TAG);
  return response;
};
