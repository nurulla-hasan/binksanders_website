import * as z from "zod";

const baseQuestionSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Question content is required"),
  isScored: z.boolean(),
});

const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("MCQ"),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  explanation: z.string().optional(),
});

const swipeSchema = baseQuestionSchema.extend({
  type: z.literal("Swipe"),
  leftLabel: z.string().min(1),
  rightLabel: z.string().min(1),
  correctDirection: z.enum(["left", "right"]),
});

const orderingSchema = baseQuestionSchema.extend({
  type: z.literal("Ordering"),
  items: z.array(z.string().min(1)).min(2),
});

const chatScenarioSchema = baseQuestionSchema.extend({
  type: z.literal("Chat Scenario"),
  messages: z
    .array(
      z.object({
        sender: z.string().min(1),
        text: z.string().min(1),
      }),
    )
    .min(1),
});

const videoSchema = baseQuestionSchema.extend({
  type: z.literal("Video"),
  videoUrl: z.string().url("Enter a valid video URL"),
});

const ratingSchema = baseQuestionSchema.extend({
  type: z.literal("Rating"),
  scale: z.coerce.number().int().min(2).max(10),
});

const freeInputSchema = baseQuestionSchema.extend({
  type: z.literal("Free Input"),
});

export const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  swipeSchema,
  orderingSchema,
  chatScenarioSchema,
  videoSchema,
  ratingSchema,
  freeInputSchema,
]);

export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.instanceof(File).optional(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

export type CreateModuleFormValues = z.infer<typeof createModuleSchema>;
export type QuestionDataSchemaType = z.infer<typeof questionSchema>;

export const getDefaultQuestionValues = (
  type: QuestionDataSchemaType["type"],
  id: string,
): QuestionDataSchemaType => {
  const base = { id, content: "", isScored: true };

  switch (type) {
    case "MCQ":
      return {
        ...base,
        type,
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      };
    case "Swipe":
      return {
        ...base,
        type,
        leftLabel: "",
        rightLabel: "",
        correctDirection: "left",
      };
    case "Ordering":
      return { ...base, type, items: ["", "", "", ""] };
    case "Chat Scenario":
      return {
        ...base,
        type,
        isScored: false,
        messages: [
          { sender: "", text: "" },
          { sender: "", text: "" },
        ],
      };
    case "Video":
      return { ...base, type, isScored: false, videoUrl: "" };
    case "Rating":
      return { ...base, type, isScored: false, scale: 5 };
    case "Free Input":
      return { ...base, type, isScored: false };
  }
};
