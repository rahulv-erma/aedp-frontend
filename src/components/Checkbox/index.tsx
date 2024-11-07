import { Checkbox as NCheckbox, CheckboxProps } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";

const Checkbox: FC<CheckboxProps> = ({
  radius = "full",
  classNames,
  ...props
}) => (
  <NCheckbox
    radius={radius}
    classNames={{
      wrapper: clsx(
        'after-content[""] after:bg-[#CA907F]',
        classNames?.wrapper,
      ),
    }}
    {...props}
  />
);

export default Checkbox;
