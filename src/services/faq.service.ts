"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { CreateFaqPayload, UpdateFaqPayload } from "@/lib/types/faq.type";
import type { TQuery } from "@/lib/types/global.type";

export const createFaq = async <T = unknown>(payload: CreateFaqPayload) =>
  nextServerFetch<ApiResponse<T>>("/faq/create-faq", {
    method: "POST",
    body: payload,
    updateTag: "faqs",
  });

export const getFaqs = async <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(`/faq/allFaq${buildQueryString(params)}`, {
    isPublic: true,
    tags: ["faqs"],
  });

export const getFaq = async <T = unknown>(faqId: string) =>
  nextServerFetch<ApiResponse<T>>(`/faq/single-faq/${faqId}`, {
    isPublic: true,
    tags: ["faqs", `faq-${faqId}`],
  });

export const updateFaq = async <T = unknown>(
  faqId: string,
  payload: UpdateFaqPayload
) =>
  nextServerFetch<ApiResponse<T>>(`/faq/update-faq/${faqId}`, {
    method: "PATCH",
    body: payload,
    updateTag: ["faqs", `faq-${faqId}`],
  });

export const deleteFaq = async <T = unknown>(faqId: string) =>
  nextServerFetch<ApiResponse<T>>(`/faq/delete-faq/${faqId}`, {
    method: "DELETE",
    updateTag: ["faqs", `faq-${faqId}`],
  });
