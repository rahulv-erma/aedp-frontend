import { Text } from "@/components/Text";

type PatientsInfoRowProps = {
  infoKey: string;
  value?: string;
};

export default function PatientsInfoRow({
  infoKey,
  value,
}: PatientsInfoRowProps) {
  return (
    <div className="flex justify-between py-3 border-b border-solid border-[#F8F8F8]">
      <Text className="text-xs font-normal leading-[23px] tracking-[0.01em]">
        {infoKey}
      </Text>
      <span className="text-[13px] font-normal leading-[23px] tracking-[0.01em] text-left text-charcoal">
        {value}
      </span>
    </div>
  );
}
