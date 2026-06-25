/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextQuestionData } from "@/lib/types/survey";

interface TextQuestionProps {
  question: TextQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function TextQuestion({ question, answerData, onAnswer }: TextQuestionProps) {
  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="space-y-3 mb-6">
        <span className="inline-block bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
          QUESTION
        </span>
        <h2 className="text-2xl md:text-3xl font-bold font-heading leading-snug text-secondary-foreground">
          {question.question}
        </h2>
      </div>

      <textarea
        className="w-full flex-1 min-h-[200px] p-4 bg-background text-foreground shadow-sm border border-primary/20 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
        placeholder="Write your thoughts here..."
        value={answerData || ""}
        onChange={(e) => onAnswer(e.target.value)}
      />
    </div>
  );
}
