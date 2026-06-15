/* eslint-disable @typescript-eslint/no-explicit-any */
import { baselineSurveyData } from "@/seed/baseline-survey";
import { socialSafetySurveyData } from "@/seed/social-safety-survey";
import { diversityInclusionData } from "@/seed/diversity-inclusion";

export interface ModuleConfig {
  id: string;
  slug: string;
  introData: {
    title: string;
    description: string;
    badge: string;
    imageUrl: string;
    questionCount: number;
    format: string;
  };
  surveyData: any[]; // Or specify BaseQuestion[] if exported
  storageKey: string;
}

export const modulesRegistry: ModuleConfig[] = [
  {
    id: "baseline",
    slug: "baseline-survey",
    introData: {
      title: "Quick Scan",
      description: "Map your team's current safety culture across 3 themes. Swipe through statements, then rate each theme 1–10.",
      badge: "Baseline",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
      questionCount: baselineSurveyData.length,
      format: "Multi",
    },
    surveyData: baselineSurveyData,
    storageKey: "module_baseline_completed",
  },
  {
    id: "social-safety",
    slug: "social-safety",
    introData: {
      title: "Social Safety at Work",
      description: "Map your team's current safety culture across 3 themes. Swipe through statements, then rate each theme 1–10.",
      badge: "Safety",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
      questionCount: socialSafetySurveyData.length,
      format: "Multi",
    },
    surveyData: socialSafetySurveyData,
    storageKey: "module_social_safety_completed",
  },
  {
    id: "diversity",
    slug: "diversity-inclusion",
    introData: {
      title: "Diversity & Inclusion",
      description: "Evaluate your workplace's commitment to creating an inclusive environment where everyone feels they belong.",
      badge: "Culture",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
      questionCount: diversityInclusionData.length,
      format: "Multi",
    },
    surveyData: diversityInclusionData,
    storageKey: "module_diversity_completed",
  }
];

export function getModuleConfig(slug: string): ModuleConfig | undefined {
  return modulesRegistry.find(m => m.slug === slug);
}
