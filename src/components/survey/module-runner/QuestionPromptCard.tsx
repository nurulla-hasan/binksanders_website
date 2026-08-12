"use client";

import { RichQuestionContent } from "@/components/ui/custom/RichQuestionContent";
import type { ModuleQuestion } from "@/lib/types/module.type";
import { MediaImage } from "./media";
import type { MediaValue } from "./types";

export function QuestionPromptCard({ question }: { question: ModuleQuestion }) {
  return (
    <div className="mb-4 shrink-0 overflow-hidden rounded-lg border border-primary/40 bg-primary/5 shadow-sm">
      <div className="p-3">
        <span className="mb-3 inline-block rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground shadow-sm">
          {question.type}
        </span>
        <RichQuestionContent
          value={question.content}
          className="font-heading text-base font-semibold leading-relaxed text-foreground"
        />
      </div>

      {question.image && (
        <div className="aspect-3/4 w-full overflow-hidden border-t border-primary/20 bg-muted/20">
          <MediaImage
            value={question.image as MediaValue}
            alt="Question visual"
            className="block h-full w-full object-cover object-center"
          />
        </div>
      )}
    </div>
  );
}
