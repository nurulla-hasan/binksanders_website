export type LegacySurveyQuestion = {
  id: number;
  type: "video" | "swipe" | "mcq" | "chat" | string;
  title?: string;
  content?: string;
};

export const baselineSurveyData: LegacySurveyQuestion[] = [
  {
    id: 1,
    type: "swipe",
    content: "I feel safe speaking up when something does not feel right.",
  },
  {
    id: 2,
    type: "swipe",
    content: "My team treats each other with respect and dignity.",
  },
  {
    id: 3,
    type: "mcq",
    content: "Choose the best response for a difficult workplace moment.",
  },
];
