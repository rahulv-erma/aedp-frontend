import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";

import { TranscriptContext } from "@/app/[locale]/(recordings)/contexts/TranscriptContext";
import { useI18n } from "@/i18n/client";
import { DropdownOption, SubIntervention } from "@/interfaces";

import Button from "../../Button";
import { Text } from "../../Text";

interface DropdownProps {
  options: DropdownOption[];
  btnLabel?: string;
  searchLabel: string;
  maxSubItems: number;
  onAddIntervention: (subInterventions: SubIntervention[]) => void;
}

const TranscriptDropdown: React.FC<DropdownProps> = ({
  options,
  btnLabel,
  searchLabel,
  maxSubItems,
  onAddIntervention,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [selectedSubItems, setSelectedSubItems] = useState<SubIntervention[]>(
    [],
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useI18n();
  const { selectedText } = useContext(TranscriptContext);

  const handleMainMenuToggle = () => {
    {
      selectedText && setOpenMenu((prev) => !prev);
    }

    setOpenSubmenus({});
  };

  const handleSubmenuToggle = (menuValue: string) => {
    setOpenSubmenus((prevState) => {
      const newSubmenus = Object.keys(prevState).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as { [key: string]: boolean },
      );

      newSubmenus[menuValue] = !prevState[menuValue];
      return newSubmenus;
    });
  };

  const handleSubItemSelect = (subItem: SubIntervention) => {
    setSelectedSubItems((prevSelected) => {
      const alreadySelected = prevSelected.some(
        (item) => item.id === subItem.id,
      );
      if (alreadySelected) {
        // Remove the item
        return prevSelected.filter((item) => item.id !== subItem.id);
      } else {
        // Add the item, but check if we have reached the limit of maxSubItems
        if (prevSelected.length >= maxSubItems) {
          return prevSelected;
        } else {
          return [...prevSelected, subItem];
        }
      }
    });
  };

  const handleAddInterventionClick = () => {
    onAddIntervention(selectedSubItems);
    setOpenMenu(false);
    setSelectedSubItems([]);
    setOpenSubmenus({});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
        setOpenSubmenus({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left w-full">
      <div
        onClick={handleMainMenuToggle}
        className="relative h-[50px] bg-gray-100 cursor-pointer p-3 rounded w-full"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm truncate">{searchLabel}</span>
          <Image src="/drop.svg" alt="drop icon" width={10} height={6} />
        </div>
      </div>

      {openMenu && (
        <div className="origin-top-left shadow-lg absolute left-0 mt-2 rounded-[8px] bg-white  z-[99]">
          <div className="min-w-[280px]">
            {options.map((menuItem) => (
              <div key={menuItem.value} className="relative">
                <button
                  onClick={() => handleSubmenuToggle(menuItem.value)}
                  className="block flex w-full text-left px-5 py-4 text-sm text-gray-700 hover:bg-[#FBF4F1] justify-between items-center"
                >
                  <div className="flex">
                    <span className="text-[#9B9D9D] text-[13px] font-[500]">
                      {menuItem.value}
                    </span>
                    <span className="!text-[#2D3031] text-[13px] font-[500] ml-[20px]">
                      {menuItem.name}
                    </span>
                  </div>
                  {menuItem.subItems && (
                    <Image
                      src="/assets/images/icons/dropdown-arrow.svg"
                      alt="drop icon"
                      width={4}
                      height={8}
                    />
                  )}
                </button>
                <div className="border-b-1 border-[#F5F5F5] mx-[15px]" />
                {menuItem.subItems && openSubmenus[menuItem.value] && (
                  <div className="absolute left-full ml-[10px] top-0 mt-0 w-48 rounded-[8px] shadow-lg bg-white min-w-[280px]">
                    {menuItem.subItems.map((subItem) => (
                      <div key={subItem.id}>
                        <div
                          onClick={() => {
                            handleSubItemSelect(subItem);
                          }}
                          className={`block w-full text-left py-4 px-5 text-sm text-gray-700 hover:bg-[#FBF4F1] ${
                            selectedSubItems.some(
                              (item) => item.id === subItem.id,
                            )
                              ? "bg-[#FBF4F1] cursor-pointer"
                              : selectedSubItems.length >= maxSubItems
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                          }`}
                        >
                          <div className="flex">
                            <span className="text-[#9B9D9D] text-[13px] font-[500]">
                              {subItem.id}
                            </span>
                            <span className="!text-[#2D3031] text-[13px] font-[500] ml-[20px]">
                              {subItem.name}
                            </span>
                          </div>
                        </div>
                        <div className="border-b-1 border-[#F5F5F5] mx-[20px]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-5 pt-[13px] pb-5">
            <Button onClick={handleAddInterventionClick}>
              <Text
                fontFamily={"abel"}
                className={"text-[13px] font-[400] !text-[white] uppercase"}
              >
                {btnLabel ? btnLabel : t("dropdown.dropdonBtnLabel")}
              </Text>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptDropdown;
