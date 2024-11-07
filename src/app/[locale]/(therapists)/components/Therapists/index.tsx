"use client";

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
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa6";

import { getPatients } from "@/app/[locale]/(patients)/actions";
import Patients from "@/app/[locale]/(patients)/components/Patients";
import { useI18n } from "@/i18n/client";
import { Therapist, Patient } from "@/interfaces";

import TherapistsSkeleton from "../../skeletons/TherapistsSkeleton";

interface TherapistsProps {
  therapists: Therapist[];
}

export default function Therapists({
  therapists: initialTherapists,
}: TherapistsProps) {
  const t = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [therapists, setTherapists] = useState<Therapist[]>(initialTherapists);
  const [arePatientsLoading, setArePatientsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null,
  );

  useEffect(() => {
    if (initialTherapists.length > 0) {
      setIsLoading(false);
      setTherapists(initialTherapists);
      handleTherapistSelect(initialTherapists[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTherapists]);

  const handleTherapistSelect = async (therapistId: string) => {
    setArePatientsLoading(true);
    const therapist = therapists.find((t) => t.id == therapistId);
    if (therapist) {
      setSelectedTherapist(therapist);
      const patientsResponse = await getPatients(therapistId);
      if (patientsResponse.success) {
        setPatients(patientsResponse?.data || []);
      } else {
        console.error("Error fetching patients:", patientsResponse);
        setPatients([]);
      }
    }
    setArePatientsLoading(false);
  };

  return (
    <div className="flex gap-5 min-h-[70vh] h-1 flex-col md:flex-row">
      <Card
        aria-labelledby="Therapists List"
        classNames={{ base: "h-full pb-6 flex-none w-full md:w-[415px]" }}
      >
        <CardHeader className="p-6">
          <h4 className="text-2xl font-abel">{t("therapists.title")}</h4>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <TherapistsSkeleton />
          ) : (
            <Table
              color="primary"
              removeWrapper
              hideHeader
              selectionMode="single"
              classNames={{
                tr: "border-b-[1px] border-[#F8F8F8] cursor-pointer",
                td: "p-6 before:!rounded-l-none before:!rounded-r-none",
              }}
              disallowEmptySelection
              defaultSelectedKeys="1"
              onSelectionChange={(keys) => {
                const therapistId = Array.from(keys)[0] as string;
                handleTherapistSelect(therapistId);
              }}
              aria-labelledby="Therapists Table"
            >
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody
                items={therapists}
                emptyContent={t("therapists.noData")}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-pewter">{item.id}</TableCell>
                    <TableCell className="!text-black">{item.name}</TableCell>
                    <TableCell className="w-10 text-pewter">
                      <FaCaretRight />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Patients
        isLoading={arePatientsLoading}
        patients={patients}
        therapist={selectedTherapist || undefined}
      />
    </div>
  );
}
