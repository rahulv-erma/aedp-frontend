"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { signup } from "@/app/[locale]/(auth)/actions";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import Link from "@/components/Link";
import Modal from "@/components/Modal";
import { Heading, Text } from "@/components/Text";
import { ROUTES } from "@/constants";
import { useI18n } from "@/i18n/client";
import { signupSchema, SignupSchemaType } from "@/schemas";
import { showToast } from "@/utils/toast";

const Signup: FC = () => {
  const router = useRouter();
  const t = useI18n();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isTermsSelected, setTermsSelection] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({ resolver: zodResolver(signupSchema) });

  const onSubmit = useCallback(
    async (formData: SignupSchemaType) => {
      const { firstName, lastName, email, password } = formData;

      const signupResponse = await signup(firstName, lastName, email, password);
      if (signupResponse.success) {
        showToast("success", t("signup.success"));
      } else {
        showToast("error", t("signup.error.general"));
      }
    },
    [t],
  );

  return (
    <div className={"min-h-screen flex justify-center items-center"}>
      <div className="flex flex-col items-center min-w-[472px] min-h-[566px] px-[36px] py-[32px] bg-white rounded-[16px] shadow-[0_26px_46px_0_#00000004,0_41px_80px_0_#00000005]">
        <div className={"w-full"}>
          <Heading fontFamily={"abel"}>{t("signup.heading")}</Heading>
        </div>
        <div className={"flex flex-col gap-[18px] mt-[24px]"}>
          <div className={"flex gap-[10px]"}>
            <Input
              label={t("signup.labels.firstName")}
              isInvalid={!!errors.firstName}
              errorMessage={t("signup.error.firstName")}
              {...register("firstName")}
            />
            <Input
              label={t("signup.labels.lastName")}
              isInvalid={!!errors.lastName}
              errorMessage={t("signup.error.lastName")}
              {...register("lastName")}
            />
          </div>
          <Input
            type="email"
            label={t("signup.labels.email")}
            isInvalid={!!errors.email}
            errorMessage={t("signup.error.email")}
            {...register("email")}
            classNames={{
              inputWrapper: "w-full",
            }}
          />
          <div className={"flex gap-[10px]"}>
            <Input
              type={"password"}
              label={t("signup.labels.password")}
              isInvalid={!!errors.password}
              errorMessage={t("signup.error.password")}
              {...register("password")}
            />
            <Input
              type={"password"}
              label={t("signup.labels.confirmPassword")}
              isInvalid={!!errors.confirmPassword}
              errorMessage={t("signup.error.confirmPassword")}
              {...register("confirmPassword")}
            />
          </div>
          <div className={"flex items-end gap-[3px] justify-start"}>
            <span className={"relative bottom-[1px]"}>
              <Checkbox
                isSelected={isTermsSelected}
                onChange={(e) => setTermsSelection(e.target.checked)}
              />
            </span>
            <div className={"flex gap-[12px]"}>
              <Text className={"font-[300] tracking-[0.5px]"}>
                {t("signup.text.agree")}
              </Text>
              <Link onClick={onOpen} className={"relative top-[2px]"}>
                {t("signup.links.terms")}
              </Link>
            </div>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            isDisabled={!isTermsSelected}
            className={"mt-[5px]"}
          >
            <Text fontFamily={"abel"} className={"[&&]:text-white"}>
              {t("signup.buttons.signup")}
            </Text>
          </Button>
          <div className={"flex my-[10px]"}>
            <Text
              className={"flex-[60%] text-center font-[300] tracking-[0.5px]"}
            >
              {t("signup.text.alreadyAccount")}
            </Text>
            <Link
              onClick={() => router.push(ROUTES.login)}
              className={"flex-[40%] relative top-[2px] left-[5px]"}
            >
              {t("signup.links.login")}
            </Link>
          </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <Text>{t("signup.text.terms")}</Text>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;
