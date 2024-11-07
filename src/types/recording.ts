import { SPEAKER_TYPE } from "@/enums";

export interface Recording {
  id: number;
  status: number;
  transcription_status: number;
  video: string;
  video_duration: number;
  recorded_at: string;
  therapist: string;
  transcription_status_details: string;
}

export type RecordingTranscript = {
  id: string;
  speaker_name: string;
  speaker_type: SPEAKER_TYPE;
  text: string;
  start_time: string;
  end_time?: string;
};

export type TranscriptSelectedTextRange = {
  startOffset: number;
  endOffset: number;
  startContainerPath: number[];
  endContainerPath: number[];
};
