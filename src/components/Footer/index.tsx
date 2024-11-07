"use client";

import Image from "next/image";
import React from "react";

import { Text } from "@/components/Text";
import { useI18n } from "@/i18n/client";

interface Props {
  className?: string;
}

const Footer: React.FC<Props> = ({ className }) => {
  const t = useI18n();

  return (
    <footer
      className={`w-full fixed bottom-0 left-0 mb-4 z-0 ${className || ""} `}
    >
      <div className="flex gap-2.5 justify-center items-center mb-4">
        <Text className="font-light">{t("footer.copyright")}</Text>
        <Image
          src="/copyright.svg"
          width={14}
          height={14}
          alt="copyright-icon"
        />
        <Text className="font-light">
          {new Date().getFullYear()} {t("footer.aedp")}
        </Text>
        <Text className="font-light">{t("footer.rightsReserved")}</Text>
      </div>
    </footer>
  );
};

export default Footer;
