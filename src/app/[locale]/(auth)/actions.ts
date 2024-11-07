"use server";

import { redirect } from "next/navigation";

import { API_ENDPOINTS, ROUTES, SOMETHING_WENT_WRONG } from "@/constants";
import { METHOD } from "@/enums";
import { APIResponse, LoginData, SignupData } from "@/interfaces";
import { baseRequest, setAuthToken, deleteAuthToken } from "@/utils";

/**
 * Server action for signing up a user.
 *
 * Sends a POST request to the signup endpoint and sets the authentication token in cookies.
 */
export const signup = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
): Promise<APIResponse<SignupData>> => {
  try {
    const response = await baseRequest<SignupData>({
      url: API_ENDPOINTS.SIGN_UP,
      method: METHOD.POST,
      data: {
        first_name,
        last_name,
        email,
        password,
      },
      cacheOptions: "no-store",
      includeAuthToken: false,
    });

    if (response.success) {
      setAuthToken(response?.data?.data?.auth_token || "");
    }
    return response;
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: SOMETHING_WENT_WRONG,
      error: JSON.stringify(error),
    };
  }
};

/**
 * Server action for logging in a user.
 *
 * Sends a POST request to the login endpoint and sets the authentication token in cookies.
 */
export const login = async (
  email: string,
  password: string,
): Promise<APIResponse<LoginData>> => {
  try {
    const response = await baseRequest<LoginData>({
      url: API_ENDPOINTS.LOG_IN,
      method: METHOD.POST,
      data: {
        email,
        password,
      },
      cacheOptions: "no-store",
      includeAuthToken: false,
    });

    if (response.success) {
      setAuthToken(response?.data?.data?.auth_token || "");
    }
    return response;
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: SOMETHING_WENT_WRONG,
      error: JSON.stringify(error),
    };
  }
};

export const logout = () => {
  deleteAuthToken();
  redirect(ROUTES.login);
};
