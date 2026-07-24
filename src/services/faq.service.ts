"use server";

import { updateTag } from "next/cache";
import { buildQueryString } from "@/lib/buildQueryString";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { CreateFaqPayload, UpdateFaqPayload } from "@/lib/types/faq.type";
import type { TQuery } from "@/lib/types/global.type";

export const createFaq = async <T = unknown>(payload: CreateFaqPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>("/faq/create-faq", {
    method: "POST",
    body: payload,
  });
  if (response && response.success) {
    updateTag("faqs");
  }
  return response;
};

export const getFaqs = async <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(`/faq/allFaq${buildQueryString(params)}`, {
    auth: "none",
    next: { tags: ["faqs"] },
  });

export const getFaq = async <T = unknown>(faqId: string) =>
  nextServerFetch<ApiResponse<T>>(`/faq/single-faq/${faqId}`, {
    auth: "none",
    next: { tags: ["faqs", `faq-${faqId}`] },
  });

export const updateFaq = async <T = unknown>(
  faqId: string,
  payload: UpdateFaqPayload
) => {
  const response = await nextServerFetch<ApiResponse<T>>(`/faq/update-faq/${faqId}`, {
    method: "PATCH",
    body: payload,
  });
  if (response && response.success) {
    updateTag("faqs");
    updateTag(`faq-${faqId}`);
  }
  return response;
};

export const deleteFaq = async <T = unknown>(faqId: string) => {
  const response = await nextServerFetch<ApiResponse<T>>(`/faq/delete-faq/${faqId}`, {
    method: "DELETE",
  });
  if (response && response.success) {
    updateTag("faqs");
    updateTag(`faq-${faqId}`);
  }
  return response;
};
