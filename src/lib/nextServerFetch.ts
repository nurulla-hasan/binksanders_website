import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

type AuthMode = "required" | "optional" | "none";

type NextServerFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: AuthMode;
  next?: NextFetchRequestConfig;
};

type ErrorSource = {
  path?: string | number;
  message?: string;
};

type ErrorResponse = {
  message?: string;
  errorSources?: ErrorSource[];
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};

const getAccessToken = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();

  return cookieStore.get("accessToken")?.value ?? null;
});

const parseJsonResponse = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    const message =
      response.status === 413
        ? "Upload exceeds the backend request-size limit. Upload a smaller file or increase the API multipart limit."
        : "API returned an invalid JSON response";

    throw new ApiError(message, response.status, {
      rawResponse: responseText.slice(0, 500),
    });
  }
};

const buildErrorMessage = (errorData: unknown, status: number): string => {
  if (!isObject(errorData)) {
    return `Request failed with status ${status}`;
  }

  const data = errorData as ErrorResponse;

  const baseMessage =
    typeof data.message === "string" && data.message.trim()
      ? data.message.trim()
      : `Request failed with status ${status}`;

  const errorSources = Array.isArray(data.errorSources)
    ? data.errorSources
    : [];

  const details = errorSources
    .map((source) => {
      const message =
        typeof source.message === "string" ? source.message.trim() : "";

      if (!message || message === baseMessage) {
        return null;
      }

      const path =
        typeof source.path === "string" || typeof source.path === "number"
          ? String(source.path).trim()
          : "";

      return path ? `${path} - ${message}` : message;
    })
    .filter(
      (value, index, values): value is string =>
        Boolean(value) && values.indexOf(value) === index,
    );

  return details.length ? `${baseMessage}: ${details.join(", ")}` : baseMessage;
};

const prepareBody = (
  body: unknown,
  headers: Headers,
  method: string,
): BodyInit | undefined => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (method === "GET" || method === "HEAD") {
    throw new TypeError(`${method} requests cannot include a body`);
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    typeof body === "string"
  ) {
    return body as BodyInit;
  }

  if (isPlainObject(body) || Array.isArray(body)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return JSON.stringify(body);
  }

  throw new TypeError("Unsupported request body type");
};

export const nextServerFetch = async <T>(
  endpoint: string,
  options: NextServerFetchOptions = {},
): Promise<T> => {
  try {
    const {
      auth = "required",
      body: rawBody,
      headers: customHeaders,
      method = "GET",
      next,
      ...requestOptions
    } = options;

    const normalizedMethod = method.toUpperCase();
    const headers = new Headers(customHeaders);

    const body = prepareBody(rawBody, headers, normalizedMethod);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

    if (!baseUrl) {
      return { success: false, message: "NEXT_PUBLIC_BASE_API is not defined", statusCode: 500 } as unknown as T;
    }

    const accessToken = auth === "none" ? null : await getAccessToken();

    if (auth === "required" && !accessToken) {
      return { success: false, message: "Authorization token is required", statusCode: 401 } as unknown as T;
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedEndpoint = endpoint.replace(/^\/+/, "");

    let response: Response;
    try {
      response = await fetch(`${normalizedBaseUrl}/${normalizedEndpoint}`, {
        ...requestOptions,
        method: normalizedMethod,
        headers,
        ...(body !== undefined ? { body } : {}),
        ...(next ? { next } : {}),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Network error";
      return {
        success: false,
        message: `Unable to connect to backend server: ${message}`,
        statusCode: 503,
      } as unknown as T;
    }

    const responseData = await parseJsonResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: buildErrorMessage(responseData, response.status),
        statusCode: response.status,
        data: responseData,
      } as unknown as T;
    }

    // Make sure we return the data as T.
    // Assuming backend returns { success, message, data, statusCode } which matches T
    return responseData as T;
  } catch (error: unknown) {
    const message = error instanceof ApiError ? error.message : error instanceof Error ? error.message : "An unexpected error occurred";
    const status = error instanceof ApiError ? error.status : 500;
    
    return {
      success: false,
      message,
      statusCode: status,
    } as unknown as T;
  }
};
