import * as z from "zod";

export const brandingSchema = z.object({
  company: z.string().min(1, "Company is required"),
  logo: z.any().refine((val) => val !== undefined && val !== null && val !== "", "Logo is required"),
  primaryBrandColor: z.string().min(1, "Primary color is required"),
  secondaryBrandColor: z.string().min(1, "Secondary color is required"),
  videoTitle: z.string().min(1, "Video title is required"),
  videoDescription: z.string().min(1, "Video description is required"),
  presenterName: z.string().min(1, "Presenter name is required"),
  presenterDesignation: z.string().min(1, "Presenter designation is required"),
  welcomeVideo: z.any().refine((val) => val !== undefined && val !== null && val !== "", "Welcome video is required"),
});

export type BrandingFormValues = z.infer<typeof brandingSchema>;
