"use client";

import Button from "@/components/Button";
import { Heading } from "@/components/Text";
import { useI18n } from "@/i18n/client";
import { Patient } from "@/interfaces/patient";

import PatientsInfoRow from "../PatientsInfoRow";

interface PatientProps {
  patient: Patient | null;
  onEditProfileClick: () => void;
}

export default function PatientDetails({
  patient,
  onEditProfileClick,
}: PatientProps) {
  const t = useI18n();

  return (
    <div>
      <div className="mb-4">
        <Heading fontFamily={"abel"} className="text-2xl">
          {patient?.name}
        </Heading>
      </div>

      <div className="space-y-2 border-t border-solid border-[#F8F8F8]">
        <PatientsInfoRow infoKey="ID" value={patient?.unique_identifier} />
        <PatientsInfoRow infoKey="Age" value={patient?.age} />
        <PatientsInfoRow infoKey="DOB" value={patient?.date_of_birth} />
        <PatientsInfoRow infoKey="Clinician" value={patient?.therapist.name} />
      </div>

      <div className="mt-6">
        <h5 className="text-2xl font-abel">{t("common.basicInformation")}</h5>
        <p className="text-pewter text-sm mt-2">
          {patient?.background_information ||
            "Patient’s background information"}
        </p>
      </div>

      <div className="mt-8">
        <Button className="text-white" onClick={onEditProfileClick}>
          {t("common.editProfile")}
        </Button>
      </div>
    </div>
  );
}
