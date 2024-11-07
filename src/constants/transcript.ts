import { DropdownOption } from "@/interfaces";

export const INTERVENTION_CARD_COLOR_SCHEMES = {
  ORANGE: {
    cardColor: "#fdf3e8",
    bgColor: "#f9dbb9",
    fillColor: "#EFA54E",
  },
  GREEN: {
    cardColor: "#60B9360D",
    bgColor: "#60B9361A",
    fillColor: "#60B936",
  },
  BLUE: {
    cardColor: "#53A0DB0D",
    bgColor: "#53A0DB1A",
    fillColor: "#53A0DB",
  },
  DEFAULT: {
    cardColor: "#fdf3e8",
    bgColor: "#f9dbb9",
    fillColor: "#EFA54E",
  },
};

export const INTERVENTION_OPTIONS: DropdownOption[] = [
  {
    value: "Intervention 1",
    name: "Name",
    subItems: [
      { id: "1A", name: "Sub-Intervention 1-1" },
      { id: "1B", name: "Sub-Intervention 1-2" },
    ],
  },
  {
    value: "Intervention 2",
    name: "Name",
    subItems: [
      { id: "2A", name: "Sub-Intervention 2-1" },
      { id: "2B", name: "Sub-Intervention 2-2" },
    ],
  },
  {
    value: "Intervention 3",
    name: "Name",
    subItems: [
      { id: "3A", name: "Sub-Intervention 3-1" },
      { id: "3B", name: "Sub-Intervention 3-2" },
    ],
  },
];

export const STATE_OPTIONS: DropdownOption[] = [
  {
    value: "State 1",
    name: "Anxiety",
    subItems: [
      { id: "1A", name: "Generalized anxiety" },
      { id: "1B", name: "Social anxiety" },
      { id: "1C", name: "Panic disorder" },
      { id: "1D", name: "Phobias" },
    ],
  },
  {
    value: "State 2",
    name: "Core affective phenomena",
    subItems: [
      { id: "2A", name: "Sadness" },
      { id: "2B", name: "Joy" },
      { id: "2C", name: "Anger" },
      { id: "2D", name: "Fear" },
    ],
  },
  {
    value: "State 3",
    name: "Metaprocessing",
    subItems: [
      { id: "3A", name: "Anxious attachment" },
      { id: "3B", name: "Categorical emotions" },
      { id: "3C", name: "Embodied ego states" },
      { id: "3D", name: "Maladaptive affective experience" },
    ],
  },
  {
    value: "State 4",
    name: "Core state",
    subItems: [
      { id: "4A", name: "Calmness" },
      { id: "4B", name: "Confidence" },
      { id: "4C", name: "Clarity" },
      { id: "4D", name: "Centeredness" },
    ],
  },
];
