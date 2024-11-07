"use server";

import { NEXT_PUBLIC_BACKEND_BASE_URL } from "@/constants/env";
import { METHOD } from "@/enums/request";
import { APIResponse } from "@/interfaces";

import { getAuthToken } from "./auth";
import { successResponse, errorResponse } from "./response";

interface BaseRequestParams {
  url: string;
  method?: METHOD;
  data?: object | FormData;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  cacheOptions?: RequestCache;
  revalidate?: number;
  includeAuthToken?: boolean;
}

/**
 * Base request utility function to make API requests using fetch.
 */
export const baseRequest = async <T>({
  url,
  method = METHOD.GET,
  data,
  headers = {},
  params,
  cacheOptions = "default",
  revalidate,
  includeAuthToken = true,
}: BaseRequestParams): Promise<APIResponse<T>> => {
  const queryParams = params ? new URLSearchParams(params).toString() : "";
  const fullUrl = `${NEXT_PUBLIC_BACKEND_BASE_URL}/${url}${
    queryParams ? `?${queryParams}` : ""
  }`;

  if (includeAuthToken) {
    try {
      const authToken = await getAuthToken();
      if (authToken) {
        headers["X-Authorization"] = `Token ${authToken}`;
      }
    } catch (error) {
      console.error("Error accessing cookies:", error);
    }
  }

  const isFormData = data instanceof FormData;
  // If sending FormData, don't set Content-Type manually (the browser does it)
  if (!isFormData) {
    headers = {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
    method,
    headers,
    body:
      [METHOD.POST, METHOD.PUT, METHOD.PATCH, METHOD.DELETE].includes(method) &&
      data
        ? isFormData
          ? data
          : JSON.stringify(data)
        : undefined,
    cache: cacheOptions,
  };

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  try {
    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return errorResponse(errorData?.detail || errorData);
    }

    const responseData =
      response.status != 204 ? await response.json() : ("" as T);
    return successResponse(responseData);
  } catch (error: any) {
    // Improve error handling: properly catch 401, 404, 500, etc.
    return errorResponse(error);
  }
};
