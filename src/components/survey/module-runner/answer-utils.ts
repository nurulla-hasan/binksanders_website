import type { ModuleQuestion } from "@/lib/types/module.type";
import type { AnswerValue } from "./types";

export const optionLabel = (index: number) => String.fromCharCode(65 + index);

const createSeed = (value: string) => {
  let seed = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    seed ^= value.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return seed >>> 0;
};

const createSeededRandom = (initialSeed: number) => {
  let seed = initialSeed || 1;

  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const shuffleOrderingItems = (question: ModuleQuestion) => {
  const original = [...(question.items ?? [])];

  if (original.length < 2) return original;
  if (original.length === 2) return [original[1], original[0]];

  const shuffled = [...original];
  const random = createSeededRandom(
    createSeed(`${question.id}-${original.join("|")}`),
  );

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  const unchanged = shuffled.every((item, index) => item === original[index]);

  if (unchanged) {
    shuffled.push(shuffled.shift() as string);
  }

  return shuffled;
};

export const initialAnswer = (question?: ModuleQuestion): AnswerValue | null => {
  if (question?.type === "Ordering") return shuffleOrderingItems(question);
  if (question?.type === "Information") return "reviewed";
  return null;
};

export const hasAnswer = (answer: AnswerValue | null) => {
  if (answer === null) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  return true;
};