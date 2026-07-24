"use server";

import { updateTag } from "next/cache";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  // AboutPayload,
  // AboutData,
  ContactPayload,
  PrivacyPayload,
  PrivacyData,
  TermsData,
  TermsPayload,
} from "@/lib/types/cms.type";

// export const upsertAbout = async <T = unknown>(payload: AboutPayload) => {
//   const response = await nextServerFetch<ApiResponse<T>>(
//     "/about/create-or-update",
//     {
//       method: "POST",
//       body: payload,
//     }
//   );
//   if (response && response.success) {
//     updateTag("about");
//   }
//   return response;
// };

// export const getAbout = async () =>
//   nextServerFetch<ApiResponse<AboutData>>("/about/retrive", {
//     auth: "none",
//     next: { tags: ["about"] },
//   });

export const upsertPrivacy = async <T = unknown>(payload: PrivacyPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    "/privacy/create-or-update",
    {
      method: "POST",
      body: payload,
    },
  );
  if (response && response.success) {
    updateTag("privacy");
  }
  return response;
};

export const getPrivacy = async () =>
  nextServerFetch<ApiResponse<PrivacyData>>("/privacy/retrive", {
    auth: "none",
    next: { tags: ["privacy"] },
  });

export const upsertTerms = async <T = unknown>(payload: TermsPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    "/terms/create-or-update",
    {
      method: "POST",
      body: payload,
    },
  );
  if (response && response.success) {
    updateTag("terms");
  }
  return response;
};

export const getTerms = async () =>
  nextServerFetch<ApiResponse<TermsData>>("/terms/retrive", {
    auth: "none",
    next: { tags: ["terms"] },
  });

export const sendSupportMessage = async <T = unknown>(
  payload: ContactPayload,
) =>
  nextServerFetch<ApiResponse<T>>("/contact/send-message", {
    method: "POST",
    body: payload,
    auth: "none",
  });
