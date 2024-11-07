"use server";

import { notFound } from "next/navigation";

import { getRecordingDetails } from "@/app/[locale]/(recordings)/actions";
import RecordingDetails from "@/app/[locale]/(recordings)/components/RecordingDetails";
import { TranscriptContextProvider } from "@/app/[locale]/(recordings)/contexts/TranscriptContext";
import { Recording } from "@/types";

type RecordingPageProps = {
  params: {
    patientId: string;
    recordingId: string;
  };
};

async function RecordingPage({ params }: RecordingPageProps) {
  const { recordingId } = params;

  const recordingResponse = await getRecordingDetails(recordingId);

  if (recordingResponse.success && recordingResponse.data) {
    const recording: Recording = recordingResponse.data;
    return (
      <TranscriptContextProvider>
        <RecordingDetails recording={recording} />
      </TranscriptContextProvider>
    );
  } else {
    console.error(
      `Error fetching recording data for ID: ${recordingId}`,
      recordingResponse,
    );
    notFound();
  }
}

export default RecordingPage;
