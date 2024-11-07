import React, { useContext } from "react";

import { TranscriptContext } from "@/app/[locale]/(recordings)/contexts/TranscriptContext";
import { INTERVENTION_OPTIONS } from "@/constants";
import { SubIntervention } from "@/interfaces";

import TranscriptDropdown from "../TranscriptDropdown";

interface InterventionDropdownProps {
  onAddIntervention: (subInterventions: SubIntervention[]) => void;
}

export default function InterventionDropdown({
  onAddIntervention,
}: InterventionDropdownProps) {
  const { selectedText } = useContext(TranscriptContext);

  return (
    <div className="">
      <TranscriptDropdown
        options={INTERVENTION_OPTIONS}
        searchLabel={"Search intervention"}
        maxSubItems={2}
        onAddIntervention={onAddIntervention}
      />
    </div>
  );
}
