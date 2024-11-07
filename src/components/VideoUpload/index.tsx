"use client";

import { Progress } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

import { useI18n } from "@/i18n/client";

import { Text } from "../Text";

export const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB
export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mkv",
  "video/webm",
  "video/avi",
];

interface VideoUploadProps {
  onVideoUpload?: (file: File | null) => void;
  progress: number;
  name?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoUpload,
  progress,
  name = "video",
}) => {
  const t = useI18n();
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoInfo = video
    ? {
        name: (video as any).name,
        size: (video.size / (1024 * 1024)).toFixed(2) + " MB",
      }
    : null;

  const validateVideo = (selectedVideo: File) => {
    if (!ACCEPTED_VIDEO_TYPES.includes(selectedVideo.type)) {
      return t("patients.recording.invalidFileType");
    }
    if (selectedVideo.size > MAX_VIDEO_SIZE) {
      return t("patients.recording.fileTooLarge");
    }
    return null;
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedVideo = event.target.files?.[0] || null;

    if (selectedVideo) {
      const validationError = validateVideo(selectedVideo);
      if (validationError) {
        setError(validationError);
        setVideo(null);
        onVideoUpload?.(null);
        return;
      }

      setError(null);
      setVideo(selectedVideo);

      if (onVideoUpload) {
        onVideoUpload(selectedVideo);
      }
    } else {
      setError(null);
      setVideo(null);
      onVideoUpload?.(null);
    }
  };

  return (
    <>
      <div
        className="w-full max-w-lg mx-auto p-4 border-2 border-dashed border-[#CA907F80] rounded-lg flex flex-col items-center"
        aria-label="Video Upload"
      >
        <label
          htmlFor={name}
          className="cursor-pointer flex flex-col items-center justify-center text-blue-500 hover:text-blue-700"
        >
          <Image
            width={40}
            height={40}
            alt="upload"
            src={"/assets/images/upload.svg"}
          />
          <div>
            <Text className="font-normal text-sm !text-[#E48C72] underline underline-offset-4 mr-[4px]">
              {t("patients.recording.chooseFile")}
            </Text>
            <Text className="font-normal text-[13px] text-[#9B9D9D]">
              {t("patients.recording.dragFile")}
            </Text>
          </div>
          <Text className="font-normal text-[13px] text-[#9B9D9D]">
            {t("patients.recording.acceptedVideoFormats")}
          </Text>
          <input
            id={name}
            type="file"
            className="hidden"
            accept={ACCEPTED_VIDEO_TYPES.join(",")}
            onChange={handleVideoChange}
          />
        </label>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
      <div className="flex mt-[32px] mb-[26px] relative">
        {video && (
          <>
            <Image
              width={40}
              height={40}
              alt="file icon"
              src="/assets/images/file.svg"
            />
            <div className="flex flex-col ml-[12px]">
              <p className="mt-2 mb-[5px] text-[#606263] font-[500] text-[13px]">
                {(video as any).name}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[13px] font-normal text-[#9B9D9D]">
                  {videoInfo?.size}
                </p>
                <div className="w-[4px] h-[4px] bg-[#CA907F] rounded-full" />
                <p className="text-[13px] font-normal text-[#9B9D9D]">
                  {progress}% {t("patients.recording.uploadComplete")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      {progress > 0 && (
        <Progress
          size="md"
          value={progress}
          classNames={{
            track: "h-[4px] rounded-none",
            indicator: "bg-[#CA907F]",
          }}
          showValueLabel={false}
          className="max-w-md"
          aria-label="Video Uploading Progress Bar"
        />
      )}
    </>
  );
};

export default VideoUpload;
