import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import { getUserData } from "@/app/[locale]/(user)/actions";
import { UserContextProvider } from "@/app/[locale]/(user)/contexts/UserContext";
import { I18nProviderClient } from "@/i18n/client";

import NextUIProvider from "./NextUIProvider";

interface Props {
  children: ReactNode;
  locale: string;
}

const GlobalProvider = async ({ children, locale }: Props) => {
  const userDataResponse = await getUserData();

  return (
    <I18nProviderClient locale={locale}>
      <UserContextProvider userData={userDataResponse?.data || null}>
        <NextUIProvider>
          {children}
          <ToastContainer theme="colored" />
        </NextUIProvider>
      </UserContextProvider>
    </I18nProviderClient>
  );
};

export default GlobalProvider;
