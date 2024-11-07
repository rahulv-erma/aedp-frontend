import clsx from "clsx";
import type { Metadata } from "next";
import { Abel, Inter } from "next/font/google";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { type ReactNode } from "react";

import NavBar from "@/components/Navbar";
import { getCurrentLocale } from "@/i18n/server";
import { GlobalProvider } from "@/providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const abel = Abel({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abel",
});

export const metadata: Metadata = {
  title: "AEDP therapists",
  description: "AEDP therapists",
};

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const locale = getCurrentLocale();

  const { device } = userAgent({ headers: headers() });
  const deviceType = device?.type === "mobile" ? "mobile" : "desktop";

  return (
    <html lang={locale} className={`${abel.variable} bg-pale_rose`}>
      <body className={clsx(inter.className, "min-w-screen min-h-screen")}>
        <GlobalProvider locale={locale}>
          <NavBar deviceType={deviceType} />
          <div className="p-8">{children}</div>
          {/* <Footer /> */}
        </GlobalProvider>
      </body>
    </html>
  );
}
