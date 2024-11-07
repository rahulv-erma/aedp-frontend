import clsx from "clsx";
import { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
};

const Link: FC<Props> = ({ children, onClick, className }) => (
  <span
    className={clsx(
      "font-[500] text-[13px] leading-[19px] tracking-[0.4px] text-coral underline underline-offset-2 cursor-pointer",
      className,
    )}
    onClick={onClick}
  >
    {children}
  </span>
);

export default Link;
