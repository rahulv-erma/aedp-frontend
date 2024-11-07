"use client";

import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { IoArrowBack, IoTrashBin } from "react-icons/io5";

import Button from "@/components/Button";
import TranscriptInterventionSection from "@/components/Transcript/TranscriptIntervention/InterventionSection";
import { Recording, RecordingTranscript } from "@/types";

import { TranscriptContext } from "../../contexts/TranscriptContext";
import RecordingTranscripts from "../RecordingTranscripts";
import RecordingVideo from "../RecordingVideo";

import DeleteRecordingModal, {
  DeleteRecordingModalRef,
} from "./DeleteRecordingModal";

interface RecordingDetailsProps {
  recording: Recording;
}

export default function RecordingDetails({ recording }: RecordingDetailsProps) {
  const router = useRouter();

  const deleteRecordingModalRef = useRef<DeleteRecordingModalRef>(null);

  const [selectedTranscript, setSelectedTranscript] =
    useState<RecordingTranscript | null>(null);
  const { selectedText } = useContext(TranscriptContext);

  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <Button
          isIconOnly
          variant="light"
          onClick={() => router.back()}
          className="w-max [&]:bg-transparent"
        >
          <IoArrowBack size={24} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          onPress={() => deleteRecordingModalRef.current?.toggleOpen()}
          className="w-max [&]:bg-transparent"
        >
          <IoTrashBin className="text-terracota" size={24} />
        </Button>
      </div>

      <div className="flex gap-4 min-h-[100vh] h-1 flex-col md:flex-row">
        <div className="grow">
          <div className="">
            <div className="">
              <RecordingVideo
                sourceUrl={recording.video}
                selectedTranscript={selectedTranscript}
              />
            </div>
            <div
              className={`my-4 ${
                selectedText ? "opacity-100" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <TranscriptInterventionSection />
            </div>
          </div>
        </div>
        <div className="w-[500px]">
          <RecordingTranscripts
            recordingId={recording.id}
            onTranscriptSelection={(transcript) =>
              setSelectedTranscript(transcript)
            }
          />
        </div>
      </div>
      <DeleteRecordingModal
        recordingId={recording.id}
        ref={deleteRecordingModalRef}
      />
    </div>
  );
}
