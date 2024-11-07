"use client";

import clsx from "clsx";
import { ReactNode } from "react";

import { SPEAKER_TYPE } from "@/enums/recording";

type BubbleContainerProps = {
  speakerType: SPEAKER_TYPE;
  children: ReactNode;
};

export default function BubbleContainer({
  speakerType,
  children,
}: BubbleContainerProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 p-5 rounded-lg relative",
        speakerType === SPEAKER_TYPE.THERAPIST
          ? "bg-linen rounded-ee-none"
          : "bg-whisper rounded-es-none",
        "container",
      )}
    >
      {children}
    </div>
  );
}
