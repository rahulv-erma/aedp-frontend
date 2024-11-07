"use client";

import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { Patient as PatientInterface } from "@/interfaces/patient";

import PatientSkeleton from "../../skeletons/PatientDetailsSkeleton";
import AddEditPatientForm from "../AddEditPatientForm";
import PatientDetails from "../PatientDetails";
import PatientRecordings from "../PatientRecordings";

interface PatientProps {
  patient: PatientInterface | null;
}

export default function Patient({ patient }: PatientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (patient) {
      setIsLoading(false);
    }
  }, [patient]);

  const renderPatientDetailsSection = () => {
    if (isEditMode && patient) {
      return (
        <AddEditPatientForm
          therapistId={patient.therapist.id}
          therapistName={patient.therapist.name}
          patient={patient}
        />
      );
    } else {
      return (
        <PatientDetails
          patient={patient}
          onEditProfileClick={() => setIsEditMode(true)}
        />
      );
    }
  };

  return (
    <div className="flex gap-5 flex-col md:flex-row ">
      <Card className="flex-none w-full md:w-[415px]">
        <CardBody className="p-6">
          {isLoading ? <PatientSkeleton /> : renderPatientDetailsSection()}
        </CardBody>
      </Card>

      {patient && <PatientRecordings isLoading={isLoading} patient={patient} />}
    </div>
  );
}
