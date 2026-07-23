import type {
  LearningModule,
  LearningPathModule,
} from "@/lib/types/module.type";

export const getLearningModuleData = (item: LearningPathModule) => {
  if (item.module) return item.module;
  if (typeof item.moduleId === "object") return item.moduleId;
  return item as LearningModule;
};

export const getLearningModuleId = (item: LearningPathModule) => {
  if (typeof item.moduleId === "string") return item.moduleId;
  return getLearningModuleData(item)._id;
};

export const getLearningModuleProgress = (item: LearningPathModule) => {
  const progress = item.userProgress ?? item.progress;

  return {
    status: progress?.status ?? item.status ?? "not_started",
    progressPercentage:
      progress?.progressPercentage ?? item.progressPercentage ?? 0,
    completedQuestions:
      progress?.completedQuestions ?? item.completedQuestions ?? 0,
    totalQuestions: progress?.totalQuestions ?? item.totalQuestions,
    score: item.score ?? 0,
  };
};
