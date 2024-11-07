"use server";

import { API_ENDPOINTS } from "@/constants";
import { APIResponse, Therapist } from "@/interfaces";
import { baseRequest } from "@/utils";

export const getTherapists = async (): Promise<APIResponse<Therapist[]>> => {
  return await baseRequest({ url: API_ENDPOINTS.THERAPISTS });
};
