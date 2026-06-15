/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultipleChoiceQuestionData } from "@/types/survey";

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function MultipleChoiceQuestion({
  question,
  answerData,
  onAnswer,
}: MultipleChoiceQuestionProps) {
  return (
    <>
      {/* Question Card */}
      <div className="bg-primary/5 text-primary-foreground p-6 shadow-sm space-y-3 relative overflow-hidden rounded-lg border border-primary/10 mb-6">
        <span className="inline-block bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">
          QUESTION
        </span>
        <h2 className="text-xl md:text-2xl font-bold font-heading leading-snug text-foreground">
          {question.question}
        </h2>
      </div>

      {/* Options List */}
      <div className="space-y-3 flex-1">
        {question.options.map((option) => {
          const isSelected = answerData === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className={`w-full flex items-center gap-4 p-4 border transition-all duration-200 text-left rounded-sm ${
                isSelected
                  ? "bg-green-500/10 border-green-500 shadow-sm"
                  : "bg-background border-border/60 hover:bg-muted/50 hover:border-border"
              }`}
            >
              {/* Option Letter Bubble */}
              <div
                className={`shrink-0 w-8 h-8 flex items-center justify-center font-bold text-sm transition-colors rounded-sm ${
                  isSelected
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {option.id}
              </div>
              
              {/* Option Text */}
              <span
                className={`text-sm leading-relaxed transition-colors duration-200 ${
                  isSelected ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
