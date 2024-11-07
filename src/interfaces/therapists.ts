import { BaseEntity } from "./general";

export interface Therapist extends BaseEntity {
  unique_identifier: string;
  name: string;
}

export interface ColumnData {
  key: string;
  label: string;
}
