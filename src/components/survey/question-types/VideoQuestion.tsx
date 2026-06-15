/* eslint-disable @typescript-eslint/no-explicit-any */
import { VideoQuestionData } from "@/types/survey";

interface VideoQuestionProps {
  question: VideoQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function VideoQuestion({ question, answerData, onAnswer }: VideoQuestionProps) {
  return (
    <div className="flex-1 flex flex-col space-y-4">
      
      {/* Video Player Placeholder */}
      <div className="w-full rounded-lg overflow-hidden bg-black aspect-video relative shadow-sm">
        <video 
          src={question.videoUrl} 
          controls 
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
        <p className="text-sm font-bold text-foreground leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3 mt-2">
        {question.options.map((option) => {
          const isSelected = answerData === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className={`w-full flex items-center p-4 border transition-all duration-200 text-left rounded-lg ${
                isSelected
                  ? "bg-green-500/10 border-green-500 shadow-sm font-semibold text-foreground"
                  : "bg-background border-border/60 hover:bg-muted/50 hover:border-border text-muted-foreground"
              }`}
            >
              <span className="text-sm leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
