"use client";

import { type ReactNode } from "react";
import React, { createContext } from "react";

import { UserData } from "@/interfaces";

interface Props {
  children: ReactNode;
  userData: UserData | null;
}

export const UserContext = createContext<UserData | null>(null);

export const UserContextProvider = ({ children, userData }: Props) => {
  return (
    <UserContext.Provider value={userData || null}>
      {children}
    </UserContext.Provider>
  );
};
