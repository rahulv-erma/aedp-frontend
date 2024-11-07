import clsx from "clsx";
import { Abel, Questrial } from "next/font/google";
import { FC, ReactNode, useMemo } from "react";

export type Props = {
  children?: ReactNode;
  className?: string;
  fontFamily?: "abel" | "questrial";
};

const fontAbel = Abel({ weight: ["400"], subsets: ["latin"] });
const fontQuestrial = Questrial({ weight: ["400"], subsets: ["latin"] });

export const Heading: FC<Props> = ({
  children,
  className,
  fontFamily = "abel",
}) => (
  <span
    className={clsx(
      fontFamily === "abel" && fontAbel.className,
      "text-[24px] leading-[30px] text-charcoal",
      className,
    )}
  >
    {children}
  </span>
);

export const Text: FC<Props> = ({ children, className, fontFamily }) => {
  const FontFamily = useMemo(() => {
    switch (fontFamily) {
      case "abel":
        return fontAbel.className;
      case "questrial":
        return fontQuestrial.className;
      default:
        return null;
    }
  }, [fontFamily]);
  return (
    <span
      className={clsx(
        FontFamily,
        "text-[13px] text-pewter tracking-[0.2px] font-[400]",
        className,
      )}
    >
      {children}
    </span>
  );
};
