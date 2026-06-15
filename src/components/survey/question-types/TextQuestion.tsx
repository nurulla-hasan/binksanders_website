/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextQuestionData } from "@/types/survey";

interface TextQuestionProps {
  question: TextQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function TextQuestion({ question, answerData, onAnswer }: TextQuestionProps) {
  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
        <p className="text-base font-medium text-foreground leading-relaxed">
          {question.question}
        </p>
      </div>

      <textarea
        className="w-full flex-1 min-h-[200px] p-4 bg-muted/30 border border-border/80 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
        placeholder="Write your thoughts here..."
        value={answerData || ""}
        onChange={(e) => onAnswer(e.target.value)}
      />
    </div>
  );
}
