"use server";

import { notFound } from "next/navigation";

import { Patient as PatientType } from "@/interfaces/patient";

import { getPatient } from "../../actions";
import Patient from "../../components/Patient";

interface PatientPageProps {
  params: {
    patientId: number;
  };
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { patientId } = params;

  const patientResponse = await getPatient(patientId);

  if (patientResponse.success && patientResponse.data) {
    const patient: PatientType = patientResponse.data;
    return <Patient patient={patient} />;
  } else {
    console.error(
      `Error fetching patient data for ID: ${patientId}`,
      patientResponse,
    );
    notFound();
  }
}
