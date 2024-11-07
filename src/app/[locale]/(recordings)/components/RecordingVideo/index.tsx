"use client";

import { useEffect, useRef } from "react";

import { RecordingTranscript } from "@/types";
import { convertTimetoSeconds } from "@/utils";

type RecordingVideoProps = {
  sourceUrl: string;
  selectedTranscript: RecordingTranscript | null;
};

export default function RecordingVideo({
  sourceUrl,
  selectedTranscript,
}: RecordingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedTranscript && videoRef.current) {
      const seconds = convertTimetoSeconds(selectedTranscript.start_time);
      videoRef.current.currentTime = seconds;
      videoRef.current?.play();
    }
  }, [selectedTranscript]);

  return (
    <video
      ref={videoRef}
      src={sourceUrl}
      controls
      className="w-full h-[500px] rounded-lg bg-black"
    />
  );
}
