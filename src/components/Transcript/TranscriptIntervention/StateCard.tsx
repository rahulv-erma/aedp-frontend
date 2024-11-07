import { Intervention, Qualifier } from "@/interfaces";

import InterventionStateCard from "./InterventionStateCard";

interface StateCardProps {
  state: Intervention;
  onRemove: () => void;
}

const StateCard: React.FC<StateCardProps> = ({ state, onRemove }) => {
  const STATE_CARD_QUALIFIERS: Qualifier[] = [
    {
      id: 1,
      qualifierName: "Intensity",
      rating: 0,
    },
    {
      id: 2,
      qualifierName: "Clarity",
      rating: 0,
    },
    {
      id: 3,
      qualifierName: "Emotion",
      rating: 0,
    },
  ];

  return (
    <InterventionStateCard
      label={state.label}
      chipText={state.subIntervention.name}
      qualifiers={STATE_CARD_QUALIFIERS}
      colorScheme={state.colorScheme}
      onRemove={onRemove}
    />
  );
};

export default StateCard;
