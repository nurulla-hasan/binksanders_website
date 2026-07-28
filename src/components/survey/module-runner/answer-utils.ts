import type { ModuleQuestion } from "@/lib/types/module.type";
import type { AnswerValue } from "./types";

export const optionLabel = (index: number) => String.fromCharCode(65 + index);

export const initialAnswer = (question?: ModuleQuestion): AnswerValue | null => {
  if (question?.type === "Ordering") return [...(question.items ?? [])];
  if (question?.type === "Information") return "reviewed";
  return null;
};

export const hasAnswer = (answer: AnswerValue | null) => {
  if (answer === null) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  return true;
};