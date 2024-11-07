"use server";

import AddPatient from "../../components/AddPatient";

interface PatientPageProps {
  params: {
    patientId: string;
  };
  searchParams: { therapistName: string; therapistID: string };
}

export default async function NewPatient({ searchParams }: PatientPageProps) {
  const therapistId = searchParams.therapistID;
  const therapistName = searchParams.therapistName;

  return <AddPatient therapistId={therapistId} therapistName={therapistName} />;
}
