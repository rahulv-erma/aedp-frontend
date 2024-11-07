import { Chip } from "@nextui-org/react";
import Image from "next/image";

import CustomRating from "@/components/CustomRating";
import { Text } from "@/components/Text";
import { Qualifier, InterventionColorScheme } from "@/interfaces";

interface InterventionStateCardProps {
  label: string;
  chipText: string;
  qualifiers: Qualifier[];
  colorScheme: InterventionColorScheme;
  onRemove: () => void;
}

const InterventionStateCard: React.FC<InterventionStateCardProps> = ({
  label,
  chipText,
  qualifiers,
  colorScheme,
  onRemove,
}) => {
  return (
    <div
      className="px-5 pt-[15px] pb-2 rounded-[8px]"
      style={{ background: colorScheme.cardColor }}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <Text className="text-[14px] font-semibold !text-[#2D3031] mr-[10px]">
            {label}
          </Text>
          <Chip
            color="warning"
            variant="flat"
            classNames={{
              base: "",
              content: "text-[11px] font-semibold",
            }}
            style={{
              backgroundColor: colorScheme.bgColor || "#60B9361A",
              color: colorScheme.fillColor,
            }}
          >
            {chipText}
          </Chip>
        </div>
        <Image
          className="cursor-pointer"
          onClick={onRemove}
          src="/assets/images/close.svg"
          alt="close icon"
          width={25}
          height={25}
        />
      </div>
      <div className="border-b border-[#EFA54E1A] mt-[15px]" />
      <div className="mt-[12px]">
        {qualifiers.map((quaifier, key) => {
          return (
            <div key={key} className="flex justify-between mb-[5px]">
              <Text>{quaifier.qualifierName}</Text>
              <CustomRating
                onRating={() => {}}
                totalStars={5}
                filColor={colorScheme.fillColor || ""}
                bgColor={colorScheme.bgColor || ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterventionStateCard;
