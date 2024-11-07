"use client";

import { useParams, useRouter } from "next/navigation";
import {
  FC,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

import { deleteRecording } from "@/app/[locale]/(recordings)/actions";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import {
  Heading,
  Text as TextComponent,
  Props as TextComponentProps,
} from "@/components/Text";
import { ROUTES } from "@/constants";
import { useCurrentLocale, useI18n } from "@/i18n/client";
import { showToast } from "@/utils/toast";

type Props = {
  recordingId: number;
};

export type DeleteRecordingModalRef = {
  toggleOpen: () => void;
};

type URLParams = {
  locale: ReturnType<typeof useCurrentLocale>;
  patientId: string;
  recordingId: string;
};

const Text: FC<TextComponentProps> = ({ ...props }) => (
  <TextComponent fontFamily="abel" {...props} />
);

const DeleteRecordingModal = forwardRef<DeleteRecordingModalRef, Props>(
  ({ recordingId }, ref) => {
    const router = useRouter();
    const t = useI18n();
    const [isOpen, setOpen] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { patientId } = useParams<URLParams>();

    const toggleOpen = useCallback(() => setOpen((o) => !o), []);
    const onDelete = useCallback(async () => {
      setInProgress(true);

      const response = await deleteRecording(recordingId);
      if (response.success) {
        router.replace("/" + ROUTES.patient(Number(patientId)));
        setTimeout(
          () => showToast("success", t("deleteRecordingModal.success")),
          1000,
        );
      } else {
        showToast("error", t("somethingWentWrong"));
      }

      setInProgress(false);
    }, [patientId, router, t, recordingId]);

    useImperativeHandle(ref, () => ({ toggleOpen }), [toggleOpen]);

    return (
      <Modal
        isOpen={isOpen}
        hideCloseButton={true}
        className="flex items-center w-[392px] h-[289px] rounded-[16px]"
      >
        <Heading className="!leading-[28.8px]">
          {t("deleteRecordingModal.deleteRecording")}
        </Heading>
        <div className="flex flex-col justify-center gap-0 items-center mt-[12px]">
          <Text className="text-slate-gray">
            {t("deleteRecordingModal.sureDelete")}
          </Text>
          <Text className="text-slate-gray">
            {t("deleteRecordingModal.recordingUndone")}
          </Text>
        </div>
        <div className="w-[320px] mt-[24px]">
          <Button
            className="bg-terracota"
            isDisabled={inProgress}
            isLoading={inProgress}
            onClick={inProgress ? undefined : onDelete}
          >
            <Text className="text-white !leading-[19.5px] uppercase">
              {t("deleteRecordingModal.yesDelete")}
            </Text>
          </Button>
          <Button className="bg-terracota10 mt-[10px]" onPress={toggleOpen}>
            <Text className="text-terracota !leading[19.5px] uppercase">
              {t("deleteRecordingModal.cancel")}
            </Text>
          </Button>
        </div>
      </Modal>
    );
  },
);

DeleteRecordingModal.displayName = "DeleteRecordingModal";

export default DeleteRecordingModal;
