import { Recording } from "@/types";

import { Therapist } from "./therapists";

export interface Patient {
  id: number;
  unique_identifier: string;
  name: string;
  age: string;
  date_of_birth: string;
  background_information: string;
  therapist: Therapist;
  recordings: Recording[];
  number_of_recordings?: number;
}
