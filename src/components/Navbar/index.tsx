"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { logout } from "@/app/[locale]/(auth)/actions";
import { useUser } from "@/app/[locale]/(user)/hooks/useUser";
import { NAVBAR_EXCLUDED_PATHS } from "@/constants";

import { Text } from "../Text";

type Props = {
  deviceType: "desktop" | "mobile";
};

export default function NavBar({ deviceType: deviceTypeServer }: Props) {
  const currentPath = usePathname();
  const isExcludedPath = NAVBAR_EXCLUDED_PATHS.some((path) =>
    currentPath.includes(path),
  );
  const user = useUser();

  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">(
    deviceTypeServer,
  );

  const isDesktop = deviceType === "desktop";

  useEffect(() => {
    const handleResize = () =>
      setDeviceType(window.innerWidth < 700 ? "mobile" : "desktop");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isExcludedPath ? null : (
    <Navbar
      classNames={{
        wrapper: "max-w-full",
      }}
    >
      {isDesktop && <NavbarContent />}
      <NavbarBrand className={clsx(isDesktop && "justify-center")}>
        <Image
          src="/aedp-logo-no-bg.png"
          alt="logo icon"
          className="p-[2px]"
          width={95.75}
          height={52}
        />
      </NavbarBrand>
      <NavbarContent justify="end" className={clsx(isDesktop && "pr-[40px]")}>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-[10px] cursor-pointer">
              <Image src="/user.svg" alt="user icon" width={40} height={40} />
              <div className="flex items-center gap-[6px]">
                <Text className="[&]:text-charcoal" fontFamily="questrial">
                  {user?.first_name || user?.last_name
                    ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
                    : user?.email}
                </Text>
                <Image src="/drop.svg" alt="drop icon" width={8} height={4} />
              </div>
            </div>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="logout" onPress={() => logout()}>
              <Text className="[&]:text-charcoal">Logout</Text>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
