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
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { ROUTES } from "@/constants";
import { useI18n } from "@/i18n/client";
import { Patient, Therapist } from "@/interfaces";

import PatientsSkeleton from "../../skeletons/PatientsSkeleton";

interface PatientTableProps {
  isLoading: boolean;
  patients: Patient[];
  therapist?: Therapist;
}

const Patients: React.FC<PatientTableProps> = ({
  isLoading,
  patients,
  therapist,
}) => {
  const t = useI18n();
  const router = useRouter();

  const handleAddPatient = () => {
    if (therapist?.id && therapist?.name) {
      router.push(ROUTES.addNewPatient(therapist.id, therapist.name));
    }
  };

  const columns: Array<{
    key: keyof Patient | "buttonAction";
    label: string;
    className?: string;
  }> = [
    {
      key: "unique_identifier",
      label: t("patients.patientId"),
      className: "text-pewter",
    },
    { key: "name", label: t("patients.patientName") },
    { key: "number_of_recordings", label: t("patients.numberOfRecordings") },
    { key: "buttonAction", label: "" },
  ];

  return (
    <Card
      aria-labelledby="Patients Card"
      className="max-w-full w-full h-full p-4 min-h-96"
    >
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-2xl font-abel">
          {therapist?.name
            ? `${therapist.name} ${t("patients.patients")}`
            : null}
        </h4>{" "}
        <Button color="primary" onClick={handleAddPatient}>
          {t("patients.addPatient")}
        </Button>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <PatientsSkeleton />
        ) : (
          <Table
            removeWrapper
            classNames={{
              table: "table-auto w-full",
              thead: "",
              tr: "border-b-[1px] border-[#F8F8F8]",
              td: "py-6",
            }}
            aria-labelledby="Patients Table"
          >
            <TableHeader>
              {columns.map((column) => (
                <TableColumn
                  key={column.key}
                  className="text-pewter font-normal"
                >
                  {column.label}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody
              items={patients}
              emptyContent={t("patients.noPatientsAvailable")}
            >
              {patients.map((patient: Patient) => (
                <TableRow key={patient.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`text-left ${column?.className}`}
                    >
                      {column.key === "buttonAction" ? (
                        <div className="flex justify-end">
                          <Link
                            href={`${ROUTES.patients}/${patient.id}`}
                            className="flex justify-end forward_link"
                          >
                            <Image
                              src="/top-right-arrow.svg"
                              width="14"
                              height="14"
                              alt="action-icon"
                            />
                          </Link>
                        </div>
                      ) : (
                        // Safely access the Patient object using type assertion
                        (patient[
                          column.key as keyof Patient
                        ] as React.ReactNode)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default Patients;
