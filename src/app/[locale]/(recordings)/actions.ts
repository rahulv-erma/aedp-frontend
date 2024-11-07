"use server";

import { API_ENDPOINTS } from "@/constants";
import { METHOD } from "@/enums";
import { APIResponse } from "@/interfaces";
import {
  Recording,
  RecordingTranscript,
  PaginatedResponse,
  AWSTemporaryCredentials,
} from "@/types";
import { baseRequest } from "@/utils";

export async function getRecordingDetails(
  recordingId: string,
): Promise<APIResponse<Recording>> {
  return await baseRequest<Recording>({
    url: `${API_ENDPOINTS.RECORDING}${recordingId}/`,
    method: METHOD.GET,
  });
}

export async function deleteRecording(
  recordingId: number,
): Promise<APIResponse<{}>> {
  return await baseRequest<{}>({
    url: `${API_ENDPOINTS.RECORDING}${recordingId}/`,
    method: METHOD.DELETE,
  });
}

export async function getRecordingTranscripts(
  recordingId: number,
  page: number = 1,
  q: string = "",
): Promise<APIResponse<PaginatedResponse<RecordingTranscript>>> {
  let url = `${API_ENDPOINTS.TRANSCRIPT}?recording__id=${recordingId}&page=${page}`;

  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  return await baseRequest({
    url,
    method: METHOD.GET,
  });
}

export async function checkTranscriptionStatus(
  recordingId: number,
): Promise<APIResponse<Recording | null>> {
  return await baseRequest({
    url: `${API_ENDPOINTS.RECORDING}${recordingId}/transcription_status`,
    method: METHOD.GET,
  });
}

export async function addTranscript(
  recordingId: number,
  transcript: RecordingTranscript,
): Promise<APIResponse<RecordingTranscript>> {
  return await baseRequest({
    url: `${API_ENDPOINTS.TRANSCRIPT}`,
    method: METHOD.POST,
    data: {
      recording: recordingId,
      speaker_name: transcript.speaker_name,
      speaker_type: transcript.speaker_type,
      text: transcript.text,
      start_time: transcript.start_time,
      end_time: transcript.end_time,
    },
  });
}

export async function updateTranscript(
  transcript: RecordingTranscript,
): Promise<APIResponse<RecordingTranscript>> {
  return await baseRequest({
    url: `${API_ENDPOINTS.TRANSCRIPT}${transcript.id}/`,
    method: METHOD.PATCH,
    data: {
      text: transcript.text,
    },
  });
}

export async function updateSpeakerName(
  transcriptId: string,
  updatedSpeakerName: string,
): Promise<APIResponse<null>> {
  return await baseRequest({
    url: `${API_ENDPOINTS.TRANSCRIPT}${transcriptId}/update_speaker_name/`,
    method: METHOD.POST,
    data: {
      speaker_name: updatedSpeakerName,
    },
  });
}

export async function updateRecordingStatus(
  recordingId: number,
  status: number,
): Promise<APIResponse<Recording>> {
  return await baseRequest({
    url: `${API_ENDPOINTS.RECORDING}${recordingId}/`,
    method: METHOD.PATCH,
    data: {
      status: status,
    },
  });
}

export async function getS3Credentials(): Promise<
  APIResponse<AWSTemporaryCredentials>
> {
  return await baseRequest({
    url: `${API_ENDPOINTS.GET_AWS_S3_CREDENTIALS}`,
    method: METHOD.GET,
  });
}
