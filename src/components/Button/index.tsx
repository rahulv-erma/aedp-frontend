import { Button as NButton } from "@nextui-org/button";
import { ButtonProps } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";

const Button: FC<ButtonProps> = ({ className, ...props }) => (
  <NButton
    {...props}
    className={clsx("w-full h-[48px] bg-dusty_coral rounded-[8px]", className)}
  >
    {props?.children}
  </NButton>
);

export default Button;
