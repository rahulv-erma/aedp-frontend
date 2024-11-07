"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@nextui-org/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { Text } from "@/components/Text";
import { ROUTES, SOMETHING_WENT_WRONG } from "@/constants";
import { useI18n } from "@/i18n/client";
import { Patient as PatientInterface } from "@/interfaces/patient";
import { addPatientSchema, AddPatientSchemaType } from "@/schemas/patient";
import { showToast } from "@/utils";

import { updatePatient, addPatient } from "../../actions";

interface AddEditPatientFormProps {
  therapistId: string;
  therapistName: string;
  patient?: PatientInterface;
}
const AddEditPatientForm = ({
  therapistId,
  therapistName,
  patient,
}: AddEditPatientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<AddPatientSchemaType>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: patient || {},
  });

  const [calculatedAge, setCalculatedAge] = useState<number | null>(
    patient?.age ? Number(patient.age) : null,
  );

  const [today, setToday] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useI18n();
  const router = useRouter();

  useEffect(() => {
    const currentDate = moment().format("YYYY-MM-DD");
    setToday(currentDate);
  }, []);

  const onSubmit = useCallback(
    async (data: AddPatientSchemaType) => {
      let response = null;
      let successMessage = "";
      setIsLoading(true);

      if (patient) {
        response = await updatePatient(patient.id, data);
        successMessage = t("patients.successfullyUpdated");
      } else {
        response = await addPatient(therapistId, data);
        successMessage = t("patients.successfullyAdded");
      }

      if (response?.success) {
        router.push("/" + ROUTES.patient(response?.data?.id || 0));
        showToast("success", successMessage);
      } else {
        showToast("error", SOMETHING_WENT_WRONG);
      }

      setIsLoading(false);
    },
    [patient, router, therapistId, t],
  );

  const calculateAge = (birthDate: string) => {
    const today = moment();
    const birth = moment(birthDate);

    return today.diff(birth, "years");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setValue("date_of_birth", selectedDate);
    clearErrors("date_of_birth");
    setCalculatedAge(calculateAge(selectedDate));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-3 pt-0 d-flex">
        <div className="flex flex-col gap-4">
          <div className="flex">
            <Input
              {...register("name")}
              errorMessage={t("patients.error.name")}
              isInvalid={!!errors.name}
              placeholder={t("patients.patientName")}
              classNames={{
                inputWrapper: "w-[275px]",
              }}
              className="!h-[27px]"
            />
          </div>
          <div className="flex items-center border-t border-[#F8F8F8] h-[57px] mt-5">
            <div className="flex items-center justify-center w-[275px]">
              <Text fontFamily="questrial" className="w-[40px]">
                {t("patients.Id")}
              </Text>
              <div className="flex">
                <Input
                  {...register("unique_identifier")}
                  errorMessage={t("patients.error.id")}
                  isInvalid={!!errors.unique_identifier}
                  classNames={{ inputWrapper: "w-[225px]" }}
                  className="!h-[27px]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center border-t border-[#F8F8F8] h-[57px]">
            <div className="flex items-center justify-between w-[275px]">
              <Text fontFamily="questrial">{t("patients.DOB")}</Text>
              <div className="flex">
                <Input
                  type="date"
                  {...register("date_of_birth")}
                  isInvalid={!!errors.date_of_birth}
                  errorMessage={t("patients.error.dob")}
                  classNames={{ inputWrapper: "w-[225px]" }}
                  className="!h-[27px]"
                  onChange={handleDateChange}
                  max={today}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center border-t border-[#F8F8F8] h-[57px]">
            <div className="flex items-center justify-between w-[275px]">
              <Text fontFamily="questrial" className="w-[40px]">
                {t("patients.patientAge")}
              </Text>
              <div className="flex relative">
                <div className="w-[225px]">
                  <Text
                    fontFamily="questrial"
                    className="font-normal leading-[23px] text-[13px] text-[#2D3031]"
                  >
                    {calculatedAge !== null ? String(calculatedAge) : ""}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center border-t border-b border-[#F8F8F8] h-[57px]">
            <div className="flex items-center">
              <Text className="mr-4">{t("patients.clinician")}</Text>
              <div>
                <Text
                  fontFamily="questrial"
                  className="font-normal text-[#2D3031]"
                >
                  {therapistName}
                </Text>
              </div>
            </div>
          </div>

          <div className="flex flex-col relative">
            <div>
              <Text fontFamily="questrial">{t("common.basicInformation")}</Text>
              <Textarea
                {...register("background_information")}
                isInvalid={!!errors.background_information}
                errorMessage={t("patients.error.basicInfo")}
                placeholder="Patient's background information"
                className="!h-[108px] placeholder:text-[#9B9D9D] placeholder:text-sm placeholder:font-normal placeholder:font-questrial"
                minRows={6}
              />
            </div>
          </div>

          <Button
            isLoading={isLoading}
            type="submit"
            className="text-[#fff] font-normal text-[13px] leading-[19.5] mt-2"
          >
            {t("common.save")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddEditPatientForm;
