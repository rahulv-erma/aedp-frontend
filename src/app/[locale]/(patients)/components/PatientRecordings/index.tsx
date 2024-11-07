import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import PatientDetailsSkeleton from "@/app/[locale]/(patients)/skeletons/PatientDetailsSkeleton";
import { updateRecordingStatus } from "@/app/[locale]/(recordings)/actions";
import { Heading, Text } from "@/components/Text";
import { SOMETHING_WENT_WRONG } from "@/constants";
import { useI18n } from "@/i18n/client";
import { Patient } from "@/interfaces";
import { Recording } from "@/types";
import { showToast, formatDuration } from "@/utils";

import AddRecordingModal from "../AddRecordingModal";

interface PatientTableProps {
  isLoading: boolean;
  patient?: Patient;
  disableAddRecording?: boolean;
}

interface StatusOption {
  key: number;
  value: string;
  label: string;
  color: string;
  iconColor: string;
}

const statusOptions: StatusOption[] = [
  {
    key: 1,
    value: "Complete",
    label: "Complete",
    color: "bg-[#0FB4330D] text-[#0FB433]",
    iconColor: "#0FB433",
  },
  {
    key: 2,
    value: "In progress",
    label: "In progress",
    color: "bg-[#EFA54E0D] text-[#EFA54E]",
    iconColor: "#EFA54E",
  },
  {
    key: 3,
    value: "Not started",
    label: "Not started",
    color: "bg-[#E85D540D] text-[#E85D54]",
    iconColor: "#E85D54",
  },
];

const PatientRecordings: React.FC<PatientTableProps> = ({
  isLoading,
  patient,
}) => {
  const t = useI18n();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  const [statuses, setStatuses] = useState<Record<number, number>>({});
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    if (patient?.recordings) {
      setRecordings(patient.recordings);
    }
  }, [patient]);

  const handleAddPatient = () => {
    onOpen();
  };

  const handleStatusChange = async (recordingId: number, key: number) => {
    const response = await updateRecordingStatus(recordingId, key);

    if (response.success && response.data) {
      const updatedRecording = response.data;
      setRecordings((prevRecordings) =>
        prevRecordings.map((recording) =>
          recording.id === updatedRecording.id ? updatedRecording : recording,
        ),
      );
    } else {
      showToast("error", response?.message || SOMETHING_WENT_WRONG);
    }
  };

  const addNewRecording = (newRecording: Recording) => {
    setRecordings((prevRecordings) => [...prevRecordings, newRecording]);
  };

  const getRecordingDetailIcon = (recordingId: number) => {
    return (
      <div className="flex justify-end">
        <Link
          href={`${pathname}/recordings/${recordingId}`}
          className="flex justify-center w-[30px] h-[30px] rounded-full bg-whisper"
        >
          <Image
            src="/assets/images/icons/edit-pencil.svg"
            width="14"
            height="14"
            alt="action-icon"
          />
        </Link>
      </div>
    );
  };

  const getAnnotationDropdown = (recording: Recording) => {
    const currentStatusKey = statuses[recording.id] || recording.status;
    const currentStatusOption = statusOptions.find(
      (opt) => opt.key === currentStatusKey,
    );

    return (
      <Dropdown>
        <DropdownTrigger>
          <div
            className={`pt-[3px] relative max-w-[110px] text-[10px] h-[30px] appearance-none rounded-full pl-4 pr-8 ${
              currentStatusOption?.color || ""
            } cursor-pointer`}
          >
            {currentStatusOption?.label || ""}
            <Text
              className={`absolute top-[3px] right-[3px] w-[24px] h-[24px] rounded-full ${
                currentStatusOption?.color || ""
              } flex flex-col items-center justify-center`}
            >
              &#x25BE;
            </Text>
          </div>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([currentStatusKey])}
          onAction={(key) => handleStatusChange(recording.id, Number(key))}
        >
          {statusOptions.map((option) => (
            <DropdownItem
              key={option.key}
              value={option.value}
              textValue={option.value}
              className={`${option.color || ""} bg-white`}
            >
              <div className="flex flex-row items-center justify-between w-full">
                <div className="font-questrial text-[10px] font-normal leading-[15px] tracking-[0.02em] text-left">
                  {option.label}
                </div>
                {currentStatusKey === option.key && (
                  <div className="flex flex-col justify-center">
                    {getCheckDropdownIcon(option.iconColor)}
                  </div>
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const getCheckDropdownIcon = (color: string) => {
    return (
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.79755 5.99999L0 3.20244L0.699387 2.50305L2.79755 4.60121L7.30061 0.0981445L8 0.797531L2.79755 5.99999Z"
          fill={color}
        />
      </svg>
    );
  };

  return (
    <Card
      aria-label="Recordings Card"
      className="max-w-full w-full h-full p-4 min-h-96"
    >
      <CardHeader className="flex justify-between items-center">
        <Heading fontFamily="abel" className="text-2xl">
          {t("patients.recordings")}
        </Heading>
        <Button color="primary" onClick={handleAddPatient} disabled={!patient}>
          {t("patients.addRecording")}
        </Button>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <PatientDetailsSkeleton />
        ) : (
          <Table
            removeWrapper
            classNames={{
              table: "table-auto w-full",
              thead: "",
              tr: "border-b-[1px] border-[#F8F8F8]",
              td: "py-6",
            }}
            aria-label="Recordings Table"
          >
            <TableHeader>
              <TableColumn>{t("patients.dateRecorded")}</TableColumn>
              <TableColumn>{t("patients.clinician")}</TableColumn>
              <TableColumn>{t("patients.duration")}</TableColumn>
              <TableColumn>{t("patients.annotationStatus")}</TableColumn>
              <TableColumn>{""}</TableColumn>
            </TableHeader>
            <TableBody
              items={recordings}
              emptyContent={t("patients.noRecordingsFound")}
            >
              {(item: Recording) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {moment(new Date(item.recorded_at)).format("DD/MM/yyyy")}
                  </TableCell>
                  <TableCell>{patient?.therapist.name}</TableCell>
                  <TableCell>
                    {item.video_duration
                      ? formatDuration(item.video_duration)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{getAnnotationDropdown(item)}</TableCell>
                  <TableCell>{getRecordingDetailIcon(item.id)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardBody>
      {patient ? (
        <AddRecordingModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          patientId={patient.id}
          onRefetch={addNewRecording}
        />
      ) : null}
    </Card>
  );
};

export default PatientRecordings;
