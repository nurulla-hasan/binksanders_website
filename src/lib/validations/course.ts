import * as z from "zod";

const baseQuestionSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Question content is required"),
  isScored: z.boolean(),
  explanation: z.string().trim().optional(),
  image: z
    .union([z.literal(""), z.string().url("Enter a valid image URL")])
    .optional(),
});

const requiredStringList = (minimum: number, message: string) =>
  z
    .array(z.string().trim())
    .transform((values) => values.filter(Boolean))
    .pipe(z.array(z.string().min(1)).min(minimum, message));

const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("MCQ"),
  options: requiredStringList(2, "Add at least two options"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

const swipeSchema = baseQuestionSchema.extend({
  type: z.literal("Swipe"),
  leftLabel: z.string().min(1),
  rightLabel: z.string().min(1),
  correctDirection: z.enum(["left", "right"]),
});

const orderingSchema = baseQuestionSchema.extend({
  type: z.literal("Ordering"),
  items: requiredStringList(2, "Add at least two ordering items"),
});

const chatScenarioSchema = baseQuestionSchema.extend({
  type: z.literal("Chat Scenario"),
  messages: z
    .array(
      z.object({
        sender: z.string().trim(),
        text: z.string().trim(),
      }),
    )
    .transform((messages) =>
      messages.filter((message) => message.sender || message.text),
    )
    .pipe(
      z
        .array(
          z.object({
            sender: z.string().min(1, "Sender is required"),
            text: z.string().min(1, "Message is required"),
          }),
        )
        .min(1, "Add at least one message"),
    ),
  options: requiredStringList(2, "Add at least two response options"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
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
        options: ["", ""],
        correctAnswer: "",
      };
    case "Video":
      return { ...base, type, isScored: false, videoUrl: "" };
    case "Rating":
      return { ...base, type, isScored: false, scale: 5 };
    case "Free Input":
      return { ...base, type, isScored: false };
  }
};
