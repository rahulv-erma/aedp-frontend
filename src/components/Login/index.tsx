"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";

import { login } from "@/app/[locale]/(auth)/actions";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "@/components/Link";
import { Heading, Text } from "@/components/Text";
import { ROUTES } from "@/constants";
import { useI18n } from "@/i18n/client";
import { loginSchema, LoginSchemaType } from "@/schemas";
import { showToast } from "@/utils/toast";

import Tooltip from "../Tooltip";

const Login: FC = () => {
  const router = useRouter();
  const t = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

  const onSubmit = useCallback(
    async (formData: LoginSchemaType) => {
      const { email, password } = formData;

      const loginResponse = await login(email, password);
      if (loginResponse.success) {
        showToast("success", t("login.success"));
        router.push(ROUTES.therapists);
      } else {
        showToast("error", t("login.error.general"));
      }
    },
    [t, router],
  );

  return (
    <div className={"min-h-screen flex justify-center items-center"}>
      <div className="min-w-[472px] min-h-[450px] flex flex-col bg-white rounded-[16px] shadow-[0_26px_46px_0_#00000004,0_41px_80px_0_#00000005] px-[36px] py-[32px]">
        <Heading fontFamily={"abel"} className={"mb-[24px]"}>
          {t("login.heading")}
        </Heading>
        <Input
          type="email"
          label={t("login.labels.email")}
          isInvalid={!!errors.email}
          errorMessage={t("login.error.email")}
          {...register("email")}
          classNames={{ inputWrapper: "w-full" }}
          className={"mb-[18px]"}
        />
        <Input
          type={"password"}
          label={t("login.labels.password")}
          isInvalid={!!errors.password}
          errorMessage={t("login.error.password")}
          {...register("password")}
          classNames={{ inputWrapper: "w-full" }}
          className={"mb-[18px]"}
        />
        <div className="flex justify-between items-center mb-5">
          <Tooltip content="Coming Soon...">
            <Link
              onClick={() => {}}
              className={"mb-[24px] disabled:opacity-50 !cursor-not-allowed"}
            >
              {t("login.links.forgotPassword")}
            </Link>
          </Tooltip>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className={"mb-[24px]"}>
          <Text fontFamily={"abel"} className={"[&&]:text-white"}>
            {t("login.buttons.login")}
          </Text>
        </Button>
        <div className={"flex justify-center gap-[5px]"}>
          <Text className={"font-[300] tracking-[0.5px]"}>
            {t("login.text.dontAccount")}
          </Text>
          <Link
            onClick={() => router.push(ROUTES.signup)}
            className={"relative top-[2px]"}
          >
            {t("login.links.signUp")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
