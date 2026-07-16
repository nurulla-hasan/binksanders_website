"use server";

import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  AboutPayload,
  AboutData,
  ContactPayload,
  PrivacyPayload,
  PrivacyData,
  TermsData,
  TermsPayload,
} from "@/lib/types/cms.type";

const upsertContent = <T>(
  endpoint: string,
  body: AboutPayload | PrivacyPayload | TermsPayload,
  tag: string
) =>
  nextServerFetch<ApiResponse<T>>(endpoint, {
    method: "POST",
    body,
    updateTag: tag,
  });

const getContent = <T>(endpoint: string, tag: string) =>
  nextServerFetch<ApiResponse<T>>(endpoint, {
    isPublic: true,
    tags: [tag],
  });

export const upsertAbout = async <T = unknown>(payload: AboutPayload) =>
  upsertContent<T>("/about/create-or-update", payload, "about");

export const getAbout = async () =>
  getContent<AboutData>("/about/retrive", "about");

export const upsertPrivacy = async <T = unknown>(payload: PrivacyPayload) =>
  upsertContent<T>("/privacy/create-or-update", payload, "privacy");

export const getPrivacy = async () =>
  getContent<PrivacyData>("/privacy/retrive", "privacy");

export const upsertTerms = async <T = unknown>(payload: TermsPayload) =>
  upsertContent<T>("/terms/create-or-update", payload, "terms");

export const getTerms = async () =>
  getContent<TermsData>("/terms/retrive", "terms");

export const sendSupportMessage = async <T = unknown>(payload: ContactPayload) =>
  nextServerFetch<ApiResponse<T>>("/contact/send-message", {
    method: "POST",
    body: payload,
    isPublic: true,
  });
