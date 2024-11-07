"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";

import AddEditPatientForm from "../AddEditPatientForm";
import PatientRecordings from "../PatientRecordings";

interface AddPatientProps {
  therapistId: string;
  therapistName: string;
}

export default function AddPatient({
  therapistId,
  therapistName,
}: AddPatientProps) {
  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <Card
        aria-label="Add Patient Card"
        classNames={{ base: "h-full pb-6 flex-none w-full md:w-[415px]" }}
      >
        <CardHeader></CardHeader>
        <CardBody className="p-6">
          <AddEditPatientForm
            therapistId={therapistId}
            therapistName={therapistName}
          />
        </CardBody>
      </Card>
      <PatientRecordings isLoading={false} disableAddRecording={true} />
    </div>
  );
}
