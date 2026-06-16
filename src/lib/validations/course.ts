import * as z from "zod";

const baseQuestionSchema = z.object({
  id: z.string(),
  excludeFromScoring: z.boolean().default(false).optional(),
});

export const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("mcq"),
  options: z.array(z.string()).min(2).default(["", "", "", ""]),
  rightAnswer: z.string().optional(),
  explanation: z.string().optional(),
  image: z.any().optional(), // File | null
  addExplanation: z.boolean().default(false).optional(),
  addImage: z.boolean().default(false).optional(),
});

export const swipeSchema = baseQuestionSchema.extend({
  type: z.literal("swipe"),
  leftSwipe: z.string().optional(),
  rightSwipe: z.string().optional(),
  explanation: z.string().optional(),
  image: z.any().optional(),
  addExplanation: z.boolean().default(false).optional(),
  addImage: z.boolean().default(false).optional(),
});

export const orderingSchema = baseQuestionSchema.extend({
  type: z.literal("ordering"),
  steps: z.array(z.string()).min(2).default(["", "", "", ""]),
  explanation: z.string().optional(),
  image: z.any().optional(),
  ableToRetry: z.boolean().default(false).optional(),
  addExplanation: z.boolean().default(false).optional(),
  addImage: z.boolean().default(false).optional(),
});

export const chatScenarioSchema = baseQuestionSchema.extend({
  type: z.literal("chat_scenario"),
  responses: z.array(z.string()).min(2).default(["", ""]),
  explanation: z.string().optional(),
  image: z.any().optional(),
  addExplanation: z.boolean().default(false).optional(),
  addImage: z.boolean().default(false).optional(),
});

export const videoSchema = baseQuestionSchema.extend({
  type: z.literal("video"),
  videoFile: z.any().optional(), // File | null
  options: z.array(z.string()).min(2).default(["", "", "", ""]),
  rightAnswer: z.string().optional(),
  explanation: z.string().optional(),
  addExplanation: z.boolean().default(false).optional(),
});

export const freeInputSchema = baseQuestionSchema.extend({
  type: z.literal("free_input"),
  explanation: z.string().optional(),
  image: z.any().optional(),
  addExplanation: z.boolean().default(false).optional(),
  addImage: z.boolean().default(false).optional(),
});

export const ratingSchema = baseQuestionSchema.extend({
  type: z.literal("rating"),
  description: z.string().optional(),
});

export const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  swipeSchema,
  orderingSchema,
  chatScenarioSchema,
  videoSchema,
  freeInputSchema,
  ratingSchema,
]);

export type QuestionDataSchemaType = z.infer<typeof questionSchema>;

export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.any().optional(), // File | null
  questions: z.array(questionSchema),
});

export type CreateModuleFormValues = z.infer<typeof createModuleSchema>;

// Default templates for newly created questions
export const getDefaultQuestionValues = (type: string, id: string): QuestionDataSchemaType => {
  const base = { id, excludeFromScoring: false };
  switch (type) {
    case "mcq":
      return { ...base, type: "mcq", options: ["", "", "", ""], rightAnswer: "", explanation: "", addExplanation: false, addImage: false };
    case "swipe":
      return { ...base, type: "swipe", leftSwipe: "", rightSwipe: "", explanation: "", addExplanation: false, addImage: false };
    case "ordering":
      return { ...base, type: "ordering", steps: ["", "", "", ""], explanation: "", ableToRetry: false, addExplanation: false, addImage: false };
    case "chat_scenario":
      return { ...base, type: "chat_scenario", responses: ["", ""], explanation: "", addExplanation: false, addImage: false };
    case "video":
      return { ...base, type: "video", options: ["", "", "", ""], rightAnswer: "", explanation: "", addExplanation: false };
    case "free_input":
      return { ...base, type: "free_input", explanation: "", addExplanation: false, addImage: false };
    case "rating":
      return { ...base, type: "rating", description: "" };
    default:
      return { ...base, type: "mcq", options: ["", "", "", ""] } as QuestionDataSchemaType;
  }
};
