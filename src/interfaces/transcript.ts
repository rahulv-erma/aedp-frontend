export interface SubIntervention {
  id: string;
  name: string;
}

export interface InterventionColorScheme {
  cardColor: string;
  bgColor: string;
  fillColor: string;
}

export interface Intervention {
  subIntervention: SubIntervention;
  id: number;
  label: string;
  colorScheme: InterventionColorScheme;
}

export interface DropdownOption {
  value: string;
  name: string;
  subItems: SubIntervention[];
}

export interface Qualifier {
  id: number;
  qualifierName: string;
  rating: number;
}
