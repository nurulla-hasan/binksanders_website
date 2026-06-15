export type QuestionType = 'swipe' | 'chat' | 'rearrange' | 'video' | 'text' | 'multiple-choice';

export interface BaseQuestion {
  id: number;
  theme: string;
  type: QuestionType;
  question: string;
}

export interface SwipeQuestionData extends BaseQuestion {
  type: 'swipe';
  statement: string;
}

export interface ChatQuestionData extends BaseQuestion {
  type: 'chat';
  botMessage: string;
  options: { id: string; text: string }[];
}

export interface RearrangeQuestionData extends BaseQuestion {
  type: 'rearrange';
  items: { id: string; text: string }[];
}

export interface VideoQuestionData extends BaseQuestion {
  type: 'video';
  videoUrl: string;
  options: { id: string; text: string }[];
}

export interface TextQuestionData extends BaseQuestion {
  type: 'text';
}

export interface MultipleChoiceQuestionData extends BaseQuestion {
  type: 'multiple-choice';
  options: { id: string; text: string }[];
}

export type SurveyQuestionType = SwipeQuestionData | ChatQuestionData | RearrangeQuestionData | VideoQuestionData | TextQuestionData | MultipleChoiceQuestionData;
