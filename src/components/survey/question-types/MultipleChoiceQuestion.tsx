/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultipleChoiceQuestionData } from "@/lib/types/survey";

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
          const isQuizMode = !!question.correctOptionId;
          const isCorrect = isQuizMode && option.id === question.correctOptionId;
          const isWrongSelection = isQuizMode && isSelected && option.id !== question.correctOptionId;
          
          let cardClasses = "bg-background border-border/60 hover:bg-muted/50 hover:border-border";
          let bubbleClasses = "bg-muted text-muted-foreground";

          if (isQuizMode && answerData) {
            if (isCorrect) {
              cardClasses = "bg-green-500/10 border-green-500/50 shadow-sm";
              bubbleClasses = "bg-green-500/20 text-green-600";
            } else if (isWrongSelection) {
              cardClasses = "bg-primary/10 border-primary/50 shadow-sm";
              bubbleClasses = "bg-primary/20 text-primary";
            } else {
              cardClasses = "bg-background border-border/30 opacity-60";
            }
          } else if (isSelected) {
            cardClasses = "bg-green-500/10 border-green-500/50 shadow-sm";
            bubbleClasses = "bg-green-500/20 text-green-600";
          }

          return (
            <button
              key={option.id}
              disabled={!!answerData && isQuizMode}
              onClick={() => onAnswer(option.id)}
              className={`w-full flex items-center gap-4 p-4 border transition-all duration-200 text-left rounded-sm ${cardClasses}`}
            >
              <div className={`shrink-0 w-8 h-8 flex items-center justify-center font-bold text-sm transition-colors rounded-sm ${bubbleClasses}`}>
                {option.id}
              </div>
              <span className={`text-sm leading-relaxed transition-colors duration-200 ${isSelected || (answerData && isCorrect) ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation */}
      {question.correctOptionId && answerData && (
        <div className="space-y-3 mt-6 animate-fadeIn">
          {answerData === question.correctOptionId ? (
            <div className="bg-green-500/10 border border-green-500/50 text-green-600 p-3 rounded-sm flex items-center gap-2 text-sm font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Correct — you got it!
            </div>
          ) : (
            <div className="bg-primary/10 border border-primary/50 text-primary p-3 rounded-sm flex items-center gap-2 text-sm font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Incorrect — correct answer is highlighted.
            </div>
          )}

          {question.explanation && answerData !== question.correctOptionId && (
            <div className="bg-background border border-primary/20 p-4 rounded-sm text-sm text-muted-foreground leading-relaxed shadow-sm">
              <span className="font-bold text-foreground">Explanation:</span> {question.explanation}
            </div>
          )}
        </div>
      )}
    </>
  );
}
