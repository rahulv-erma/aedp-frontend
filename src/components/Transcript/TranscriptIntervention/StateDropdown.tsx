import React from "react";

import { STATE_OPTIONS } from "@/constants";
import { SubIntervention } from "@/interfaces";

import TranscriptDropdown from "../TranscriptDropdown";

interface StateDropdownProps {
  onAddIntervention: (subInterventions: SubIntervention[]) => void;
}

export default function StateDropdown({
  onAddIntervention,
}: StateDropdownProps) {
  return (
    <TranscriptDropdown
      options={STATE_OPTIONS}
      btnLabel={"Add State"}
      searchLabel="Search State"
      maxSubItems={1}
      onAddIntervention={onAddIntervention}
    />
  );
}
