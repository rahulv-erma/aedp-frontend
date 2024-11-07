"use client";

import React, { useState, type ReactNode, createContext } from "react";

import { TranscriptSelectedTextRange } from "@/types";

type ContextType = {
  selectedText?: string | null;
  selectedTextRange?: TranscriptSelectedTextRange | null;
  selectedTextTranscriptId?: string | null;
  setSelectedText: (text: string | null) => void;
  setSelectedTextRange: (range: TranscriptSelectedTextRange | null) => void;
  setSelectedTextTranscriptId: (id: string | null) => void;
};

interface Props {
  children: ReactNode;
}

export const TranscriptContext = createContext<ContextType>({
  setSelectedText: (_: string | null) => {},
  setSelectedTextRange: (_: TranscriptSelectedTextRange | null) => {},
  setSelectedTextTranscriptId: (_: string | null) => {},
});

export const TranscriptContextProvider = ({ children }: Props) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedTextRange, setSelectedTextRange] =
    useState<TranscriptSelectedTextRange | null>(null);
  const [selectedTextTranscriptId, setSelectedTextTranscriptId] = useState<
    string | null
  >(null);

  return (
    <TranscriptContext.Provider
      value={{
        selectedText,
        selectedTextRange,
        selectedTextTranscriptId,
        setSelectedText,
        setSelectedTextRange,
        setSelectedTextTranscriptId,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};
