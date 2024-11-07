import React, { useState } from "react";

import {
  INTERVENTION_CARD_COLOR_SCHEMES,
  INTERVENTION_OPTIONS,
  STATE_OPTIONS,
} from "@/constants";
import { useI18n } from "@/i18n/client";
import { Intervention, SubIntervention } from "@/interfaces";
import { findParentDropdownOption, showToast } from "@/utils";

import InterventionCard from "./InterventionCard";
import InterventionDropdown from "./InterventionDropdown";
import StateCard from "./StateCard";
import StateDropdown from "./StateDropdown";

export default function TranscriptInterventionSection() {
  const t = useI18n();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [state, setState] = useState<Intervention | null>();

  const handleAddIntervention = (subInterventions: SubIntervention[]) => {
    if (interventions.length >= 2) {
      showToast("info", t("recording.transcript.maxInterventionsAllowed"));
      return;
    }

    setInterventions((prevInterventions) => {
      const nextInterventionId =
        prevInterventions.length > 0
          ? Math.max(
              ...prevInterventions.map((intervention) => intervention.id),
            ) + 1
          : 1;

      const newInterventions = subInterventions.map(
        (subIntervention, index) => {
          const interventionId = nextInterventionId + index;
          const parentDropdownOption = findParentDropdownOption(
            subIntervention.id,
            INTERVENTION_OPTIONS,
          );
          return {
            subIntervention,
            id: interventionId,
            label: parentDropdownOption
              ? parentDropdownOption.value
              : `Intervetion ${interventionId}`,
            colorScheme: getInterventionColorScheme(interventionId),
          } as Intervention;
        },
      );

      return [...prevInterventions, ...newInterventions];
    });
  };

  const handleAddState = (subInterventions: SubIntervention[]) => {
    const subIntervention = subInterventions[0];
    const stateId = 1;
    const parentDropdownOption = findParentDropdownOption(
      subIntervention.id,
      STATE_OPTIONS,
    );

    const intervention: Intervention = {
      subIntervention: subIntervention,
      id: stateId,
      label: parentDropdownOption
        ? parentDropdownOption.value
        : `State ${stateId}`,
      colorScheme: INTERVENTION_CARD_COLOR_SCHEMES.BLUE,
    };
    setState(intervention);
  };

  const handleRemoveIntervention = (indexToRemove: number) => {
    setInterventions((prevInterventions) =>
      prevInterventions.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleRemoveState = () => {
    setState(null);
  };

  const getInterventionColorScheme = (id: number) => {
    switch (id) {
      case 1:
        return INTERVENTION_CARD_COLOR_SCHEMES.ORANGE;
      case 2:
        return INTERVENTION_CARD_COLOR_SCHEMES.GREEN;
      default:
        return INTERVENTION_CARD_COLOR_SCHEMES.DEFAULT;
    }
  };

  const getEmptyCardPlaceholder = () => {
    return <div className="bg-gray-100 h-[180px] rounded-[8px]"></div>;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <InterventionDropdown onAddIntervention={handleAddIntervention} />
        </div>
        <div>
          <StateDropdown onAddIntervention={handleAddState} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Intervention Cards Section */}
        {interventions.map((intervention, index) => (
          <InterventionCard
            key={index}
            intervention={intervention}
            onRemove={() => handleRemoveIntervention(index)}
          />
        ))}
        {interventions.length < 2 && getEmptyCardPlaceholder()}
        {interventions.length < 1 && getEmptyCardPlaceholder()}

        {/* State Card Section */}
        {state ? (
          <StateCard state={state} onRemove={handleRemoveState} />
        ) : (
          getEmptyCardPlaceholder()
        )}
      </div>
      <div className="bg-gray-100 h-32 rounded-[8px]">
        <textarea
          className="w-full h-full p-4 bg-transparent focus:outline-none text-sm"
          placeholder="Notes"
        ></textarea>
      </div>
    </div>
  );
}
