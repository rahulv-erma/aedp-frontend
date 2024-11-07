import { z } from "zod";

export const addPatientSchema = z.object({
  unique_identifier: z.string().min(1),
  name: z.string().min(2),
  date_of_birth: z.string().min(1),
  background_information: z.string().min(10),
});

export type AddPatientSchemaType = z.infer<typeof addPatientSchema>;
