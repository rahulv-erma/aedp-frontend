"use client";

import Image from "next/image";
import React, { FC } from "react";

interface Props {
  topOffset: number;
  leftOffset: number;
  onClickEditIcon: () => void;
  onClickBookmarkIcon: () => void;
}

const ActionButtons: FC<Props> = ({
  topOffset,
  leftOffset,
  onClickEditIcon,
  onClickBookmarkIcon,
}) => {
  const buttonClasses =
    "cursor-pointer hover:opacity-80 flex items-center justify-center w-[30px] h-[30px] bg-whisper rounded-full shadow-soft";

  return (
    <div
      style={{ top: `${topOffset}px`, left: `${leftOffset}px` }}
      className="absolute z-10 action-buttons w-[80px] h-[46px] flex items-center justify-center rounded-full bg-white shadow-elevated gap-[4px]"
    >
      <button
        onClick={onClickEditIcon}
        className={buttonClasses}
        aria-label="Edit"
      >
        <Image
          src="/assets/images/icons/edit-pencil.svg"
          width={12}
          height={12}
          alt="edit icon"
        />
      </button>
      <button
        onClick={onClickBookmarkIcon}
        className={buttonClasses}
        aria-label="Bookmark"
      >
        <Image
          src="/assets/images/icons/bookmark.svg"
          width={10}
          height={10}
          alt="bookmark icon"
        />
      </button>
    </div>
  );
};

export default ActionButtons;
