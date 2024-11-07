"use client";

import { Input } from "@nextui-org/react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosPlayCircle } from "react-icons/io";

import { updateSpeakerName } from "@/app/[locale]/(recordings)/actions";
import { RecordingTranscriptWithEditing } from "@/app/[locale]/(recordings)/components/RecordingTranscripts";
import { SPEAKER_TYPE } from "@/enums/recording";
import { useI18n } from "@/i18n/client";
import { RecordingTranscript } from "@/types";
import { showToast } from "@/utils";

import AddEditTranscriptBubble from "./TranscriptBubble/AddEditBubble";
import TranscriptBubble from "./TranscriptBubble/Bubble";
import ArrowButtons from "./TranscriptBubble/Buttons/ArrowButtons";

type TranscriptItemProps = {
  transcript: RecordingTranscript;
  isAddingNewTranscript: boolean;
  isNewTranscriptArrowButtonsShowing: boolean;
  toggleNewTranscriptArrowButtons: () => void;
  handleAddNewTranscriptBubble: (
    transcript: RecordingTranscript,
    position: "up" | "down",
  ) => void;
  handleAddEditTranscript: (
    id: string,
    text: string,
    isEditMode: boolean,
  ) => void;
  onTranscriptSelection: (transcript: RecordingTranscript) => void;
  onSpeakerNameUpdated: (
    updatedSpeakerName: string,
    speakerType: RecordingTranscript["speaker_type"],
  ) => void;
  transcripts: RecordingTranscriptWithEditing[];
  setTranscripts: Dispatch<SetStateAction<RecordingTranscriptWithEditing[]>>;
};

export default function TranscriptItem({
  transcript,
  isAddingNewTranscript,
  isNewTranscriptArrowButtonsShowing,
  toggleNewTranscriptArrowButtons,
  handleAddNewTranscriptBubble,
  handleAddEditTranscript,
  onTranscriptSelection,
  onSpeakerNameUpdated,
  transcripts,
  setTranscripts,
}: TranscriptItemProps) {
  const t = useI18n();

  const speakerNameRef = useRef<HTMLInputElement>(null);
  const [isAddMode, setIsAddMode] = useState(isAddingNewTranscript);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSpeakerNameEditMode, setIsSpeakerNameEditMode] = useState(false);
  const [transcriptText, setTranscriptText] = useState(transcript.text);

  const handleAddUp = () => {
    handleAddNewTranscriptBubble(transcript, "up");
  };

  const handleAddDown = () => {
    handleAddNewTranscriptBubble(transcript, "down");
  };

  const handleSave = (updatedText: string) => {
    handleAddEditTranscript(transcript.id, updatedText, isEditMode);
    setIsAddMode(false);
    setIsEditMode(false);
  };

  const handleBubbleEdit = (selectedText: string) => {
    setTranscriptText(selectedText);
    setIsEditMode((prev) => !prev);
  };

  const handleUpdateSpeakerName = async () => {
    const updatedName = speakerNameRef?.current?.value;
    if (updatedName) {
      const response = await updateSpeakerName(transcript.id, updatedName);
      console.log(response);
      if (response.success) {
        onSpeakerNameUpdated(updatedName, transcript.speaker_type);
      } else {
        showToast("error", t("somethingWentWrong"));
      }
    }
    setIsSpeakerNameEditMode(false);
  };

  return (
    <div
      key={transcript.id}
      className={clsx(
        "mt-8 w-4/5",
        transcript.speaker_type === SPEAKER_TYPE.THERAPIST && "ms-auto",
      )}
    >
      <div className="flex justify-between items-center ps-4 pe-12 gap-4">
        <div className="flex items-center gap-2">
          <IoIosPlayCircle
            size={20}
            className="text-primary cursor-pointer"
            onClick={() => onTranscriptSelection({ ...transcript })}
          />
          {isSpeakerNameEditMode ? (
            <>
              <Input
                ref={speakerNameRef}
                size="sm"
                variant="bordered"
                defaultValue={transcript.speaker_name}
                classNames={{
                  input: "text-xs",
                }}
              />
              <FaCheckCircle
                size={20}
                className="text-primary cursor-pointer"
                onClick={handleUpdateSpeakerName}
              />
            </>
          ) : (
            <span
              className="text-sm font-semibold"
              onDoubleClick={() => setIsSpeakerNameEditMode(true)}
            >
              {transcript.speaker_name}
            </span>
          )}
        </div>
        <span className="text-xs text-pewter">{transcript.start_time}</span>
      </div>
      <div className="flex items-center gap-4 mt-2">
        {isAddMode || isEditMode ? (
          <AddEditTranscriptBubble
            value={transcript.text}
            speakerType={transcript.speaker_type}
            onSave={handleSave}
          />
        ) : (
          <>
            <TranscriptBubble
              transcript={transcript}
              handleBubbleEdit={handleBubbleEdit}
              transcripts={transcripts}
              setTranscripts={setTranscripts}
            />
            <button onClick={toggleNewTranscriptArrowButtons}>
              <FaCirclePlus
                size={20}
                className="text-whisper bg-primary rounded-full"
              />
            </button>
          </>
        )}
        {isNewTranscriptArrowButtonsShowing && (
          <ArrowButtons onUpClick={handleAddUp} onDownClick={handleAddDown} />
        )}
      </div>
    </div>
  );
}
