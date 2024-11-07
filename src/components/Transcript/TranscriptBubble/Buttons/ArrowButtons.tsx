import { Divider } from "@nextui-org/divider";
import React, { FC } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Props {
  onUpClick?: () => void;
  onDownClick?: () => void;
}

const ArrowButtons: FC<Props> = ({ onUpClick, onDownClick }) => {
  const buttonClasses =
    "flex items-center justify-center w-full h-1/2 hover:bg-gray-300";
  const buttonSize = 10;

  return (
    <div className="flex flex-col items-center justify-center w-5 h-10 bg-gray-200 rounded-lg shadow-md">
      <button onClick={onUpClick} className={`${buttonClasses} rounded-t-lg`}>
        <FaArrowUp className="text-gray-600" size={buttonSize} />
      </button>
      <Divider />
      <button onClick={onDownClick} className={`${buttonClasses} rounded-b-lg`}>
        <FaArrowDown className="text-gray-600" size={buttonSize} />
      </button>
    </div>
  );
};

export default ArrowButtons;
