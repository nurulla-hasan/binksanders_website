export type CreateFaqPayload = {
  Ques: string;
  Answere: string;
};

export type UpdateFaqPayload = Partial<CreateFaqPayload>;
