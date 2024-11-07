"use server";

import { Therapist } from "@/interfaces";

import { getTherapists } from "../actions";
import Therapists from "../components/Therapists";

export default async function TherapistsPage() {
  let therapists: Therapist[] = [];

  const response = await getTherapists();
  if (response.success) {
    therapists = response.data || [];
  } else {
    console.error("Error fetching therapists:", response?.error);
    therapists = [];
  }

  return <Therapists therapists={therapists} />;
}
