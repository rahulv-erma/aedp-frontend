import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  checkTranscriptionStatus,
  getS3Credentials,
} from "@/app/[locale]/(recordings)/actions";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { Text } from "@/components/Text";
import VideoUpload from "@/components/VideoUpload";
import { SOMETHING_WENT_WRONG, API_ENDPOINTS } from "@/constants";
import { TRANSCRIPTION_STATUS, METHOD } from "@/enums";
import { useI18n } from "@/i18n/client";
import { Recording } from "@/types";
import { showToast, baseRequest, uploadToS3 } from "@/utils";

interface AddRecordingModalProps {
  isOpen?: boolean;
  onOpenChange?: () => void;
  onRefetch?: (recording: Recording) => void;
  patientId: number;
}

const AddRecordingModal: React.FC<AddRecordingModalProps> = ({
  isOpen,
  onOpenChange,
  onRefetch,
  patientId,
}) => {
  const t = useI18n();
  const [uploadingProgress, setUploadingProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [video, setVideo] = useState<File | null>(null);
  const [videoUploadingMessage, setVideoUploadingMessage] =
    useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const validateVideo = (file: File | null): boolean => {
    if (!file) return false;
    const validTypes = ["video/mp4", "video/webm"];
    return validTypes.includes(file.type);
  };

  const addRecording = async (video: File): Promise<void> => {
    try {
      setVideoUploadingMessage(t("addRecordingModal.preparingS3Upload"));
      const awsTempCredentialsResponse = await getS3Credentials();
      if (
        !awsTempCredentialsResponse.success ||
        !awsTempCredentialsResponse.data
      ) {
        throw "An error occurred while getting s3 credentials.";
      }

      setVideoUploadingMessage(t("addRecordingModal.uploadingToS3"));
      const uploadedFileResponse = await uploadToS3(
        video,
        awsTempCredentialsResponse.data,
      );
      if (uploadedFileResponse.s3Response.$metadata.httpStatusCode !== 200) {
        throw "An error occurred while uploading the file to s3";
      }

      setVideoUploadingMessage(t("addRecordingModal.transcriptionInProcess"));
      const addRecordingResponse = await baseRequest<Recording>({
        url: `${API_ENDPOINTS.RECORDING}create_recording/`,
        method: METHOD.POST,
        data: {
          patient_id: patientId,
          s3_object_key: uploadedFileResponse.fileKey,
        },
      });

      if (addRecordingResponse.success) {
        await checkVideoTranscriptionStatus(addRecordingResponse.data?.id || 0);
      } else {
        toggleUploadingState(true);
        showToast("error", String(addRecordingResponse.error));
      }
    } catch (error) {
      console.error(error);
      showToast("error", t("somethingWentWrong"));
    }
  };

  const onSubmit = async () => {
    if (!video || !validateVideo(video)) {
      showToast("error", t("addRecordingModal.videoValidationMessage"));
      return;
    }

    toggleUploadingState();
    setUploadingProgress(10);
    await addRecording(video);
  };

  const checkVideoTranscriptionStatus = async (recordingId: number) => {
    try {
      const pollVideoTranscriptionStatus = async () => {
        const response = await checkTranscriptionStatus(recordingId);
        if (response.status) {
          const transcriptionStatus = response.data?.transcription_status;
          if (transcriptionStatus === TRANSCRIPTION_STATUS.FAILED) {
            toggleUploadingState(true);
            showToast(
              "error",
              response.data?.transcription_status_details ||
                SOMETHING_WENT_WRONG,
            );
          } else if (transcriptionStatus === TRANSCRIPTION_STATUS.COMPLETED) {
            toggleUploadingState(true);
            showToast("success", t("addRecordingModal.transcriptionSuccess"));
            onOpenChange?.();
            response.data ? onRefetch?.(response.data) : null;
          }
        } else {
          toggleUploadingState(true);
          showToast("error", response.message || SOMETHING_WENT_WRONG);
        }

        setUploadingProgress((prevProgress) =>
          prevProgress < 90 ? prevProgress + 15 : 90,
        );
        if (
          response.data?.transcription_status !==
            TRANSCRIPTION_STATUS.COMPLETED &&
          response.data?.transcription_status !== TRANSCRIPTION_STATUS.FAILED
        ) {
          setTimeout(pollVideoTranscriptionStatus, 3000);
        }
      };

      await pollVideoTranscriptionStatus();
    } catch (error) {
      toggleUploadingState(true);
      console.error("Error checking video transcription status:", error);
      showToast("error", SOMETHING_WENT_WRONG);
    }
  };

  const toggleUploadingState = (reset = false) => {
    if (reset) {
      setUploadingProgress(0);
      setIsUploading(false);
      setVideoUploadingMessage("");
    } else {
      setIsUploading(true);
    }
  };

  const handleModalClose = () => {
    if (!isUploading) {
      onOpenChange?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleModalClose}
      className="p-[36px]"
      hideCloseButton={isUploading}
      size="lg"
      aria-label="Recording Modal"
    >
      <Text className="text-[24px] !text-[#2D3031]" fontFamily="abel">
        {t("addRecordingModal.modalHeading")}
      </Text>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="mt-6">
          <VideoUpload
            onVideoUpload={setVideo}
            progress={uploadingProgress}
            name="video"
          />
          {videoUploadingMessage && (
            <div className="mt-4">
              <Text className="text-[#E48C72]">{videoUploadingMessage}</Text>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Button
            isDisabled={isUploading}
            isLoading={isUploading}
            type="submit"
            className={`mt-6 bg-[#CA907F] text-white text-[13px] font-[abel] font-normal rounded-[8px]`}
          >
            {isUploading
              ? t("addRecordingModal.uploadingBtn")
              : t("addRecordingModal.nextBtn")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRecordingModal;
