import { SOMETHING_WENT_WRONG } from "@/constants";
import { APIResponse } from "@/interfaces";

/**
 * Returns a standardized success response object.
 */
export const successResponse = <T>(
  data: T,
  message = "",
  status = 200,
): APIResponse<T> => {
  return {
    success: true,
    status: status,
    message: message,
    data: data,
  };
};

/**
 * Returns a standardized error response object.
 */
export const errorResponse = <T>(
  error: any,
  message = SOMETHING_WENT_WRONG,
  status = 500,
): APIResponse<T> => {
  return {
    success: false,
    status: status,
    message: message,
    error: JSON.stringify(error),
  };
};
