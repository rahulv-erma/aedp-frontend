import { Intervention, Qualifier } from "@/interfaces";

import InterventionStateCard from "./InterventionStateCard";

interface InterventionCardProps {
  intervention: Intervention;
  onRemove: () => void;
}

const InterventionCard: React.FC<InterventionCardProps> = ({
  intervention,
  onRemove,
}) => {
  const INTERVENTION_CARD_QUALIFIERS: Qualifier[] = [
    {
      id: 1,
      qualifierName: "Affect-ladenness",
      rating: 0,
    },
    {
      id: 2,
      qualifierName: "Relationality",
      rating: 0,
    },
    {
      id: 3,
      qualifierName: "Positivity",
      rating: 0,
    },
  ];

  return (
    <InterventionStateCard
      label={intervention.label}
      chipText={intervention.subIntervention.id}
      qualifiers={INTERVENTION_CARD_QUALIFIERS}
      colorScheme={intervention.colorScheme}
      onRemove={onRemove}
    />
  );
};

export default InterventionCard;
