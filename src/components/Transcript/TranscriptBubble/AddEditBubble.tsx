"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import { SPEAKER_TYPE } from "@/enums/recording";

import TranscriptBubbleContainer from "./BubbleContainer";

type AddEditBubbleProps = {
  value: string;
  speakerType: SPEAKER_TYPE;
  onSave: (value: string) => void;
};

export default function AddEditBubble({
  value,
  speakerType,
  onSave,
}: AddEditBubbleProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleSave = () => {
    onSave(inputValue);
  };

  return (
    <TranscriptBubbleContainer speakerType={speakerType}>
      <div className="flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="border text-xs w-full rounded p-2"
          placeholder="Enter transcript text"
        />
      </div>
      <button onClick={handleSave} className="text-primary">
        <FaCheckCircle size={20} />
      </button>
    </TranscriptBubbleContainer>
  );
}
