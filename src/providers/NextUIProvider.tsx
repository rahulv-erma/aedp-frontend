"use client";

import { NextUIProvider as Provider } from "@nextui-org/react";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const NextUIProvider = ({ children }: Props) => {
  return <Provider>{children}</Provider>;
};

export default NextUIProvider;
