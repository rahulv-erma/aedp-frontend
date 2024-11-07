import { Input as NInput, InputProps } from "@nextui-org/react";
import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      labelPlacement = "outside",
      placeholder = " ",
      classNames,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const EndContent = useMemo(() => {
      if (type === "password") {
        return (
          <Image
            src="/eye.svg"
            width={18}
            height={8}
            alt="eye-icon"
            className={"cursor-pointer"}
            onClick={() => setShowPassword((p) => !p)}
          />
        );
      }
      return props?.endContent;
    }, [type, props?.endContent]);

    const Type = useMemo(() => {
      if (type === "password") {
        return showPassword ? "text" : "password";
      }
      return type;
    }, [type, showPassword]);

    return (
      <NInput
        ref={ref}
        type={Type}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        classNames={{
          label: clsx(
            "font-[350] text-[13px] leading-[23px] pb-[2px] tracking-[0.2px] !text-pewter",
            classNames?.label,
          ),
          inputWrapper: clsx(
            "w-[195px] h-[48px] rounded-[8px] bg-whisper",
            classNames?.inputWrapper,
          ),
        }}
        endContent={EndContent}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
