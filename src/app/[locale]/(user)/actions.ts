"use server";

import { API_ENDPOINTS } from "@/constants";
import { METHOD } from "@/enums";
import { APIResponse, UserData } from "@/interfaces";
import { baseRequest, getAuthToken } from "@/utils";

/**
 * Fetches user data from the backend API using the auth token from cookies.
 */
export const getUserData = async (): Promise<APIResponse<UserData | null>> => {
  const authToken = getAuthToken();

  if (!authToken) {
    // User is not authenticated
    return {
      success: false,
      status: 403,
      message: "User is not authenticated",
    };
  }

  return await baseRequest<UserData>({
    url: API_ENDPOINTS.USER_PROFILE,
    method: METHOD.GET,
    cacheOptions: "force-cache",
  });
};
