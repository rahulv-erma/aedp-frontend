"use server";

import { API_ENDPOINTS } from "@/constants";
import { METHOD } from "@/enums";
import { APIResponse, Patient } from "@/interfaces";
import { AddPatientSchemaType } from "@/schemas/patient";
import { baseRequest } from "@/utils";

export const getPatients = async (
  therapistId: string,
): Promise<APIResponse<Patient[]>> => {
  const temp = await baseRequest<Patient[]>({
    url: `${API_ENDPOINTS.PATIENT}?therapist__id=${therapistId}`,
  });
  return temp;
};

export const getPatient = async (
  patientId: number,
): Promise<APIResponse<Patient>> => {
  return await baseRequest({
    url: `${API_ENDPOINTS.PATIENT}${patientId}/`,
    cacheOptions: "no-cache",
  });
};

export const addPatient = async (
  therapistId: string,
  patient: AddPatientSchemaType,
): Promise<APIResponse<Patient>> => {
  return await baseRequest({
    url: API_ENDPOINTS.PATIENT,
    method: METHOD.POST,
    data: {
      therapist_id: therapistId,
      ...patient,
    },
  });
};

export const updatePatient = async (
  patientId: number,
  patient: AddPatientSchemaType,
): Promise<APIResponse<Patient>> => {
  return await baseRequest({
    url: `${API_ENDPOINTS.PATIENT}${patientId}/`,
    method: METHOD.PUT,
    data: patient,
  });
};
