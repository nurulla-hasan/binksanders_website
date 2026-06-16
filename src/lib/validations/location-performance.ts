import * as z from "zod";

export const generateQrSchema = z.object({
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location/Team Name is required"),
  logMethod: z.string().min(1, "Log method is required"),
  password: z.string().optional(), // It might be optional if anonymous is selected, but let's make it optional in schema and validate dynamically or just keep it optional.
  courses: z.array(z.string()).min(1, "At least one course must be linked"),
});

export type GenerateQrFormValues = z.infer<typeof generateQrSchema>;
