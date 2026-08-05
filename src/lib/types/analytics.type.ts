import type { ModuleQuestionType } from "./module.type";

export type ModuleAnalyticsAnswer = string | number | string[];

export type ModuleAnalyticsResponse = {
  answer: ModuleAnalyticsAnswer;
  count: number;
  percentage: number;
};

export type ModuleQuestionStatistic = {
  questionId: string;
  type: ModuleQuestionType;
  content?: string;
  totalAnswers: number;
  responses: ModuleAnalyticsResponse[];
};

export type ModuleQuestionAnalyticsData = {
  moduleId: string;
  moduleTitle: string;
  stats: ModuleQuestionStatistic[];
};
