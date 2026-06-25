/* eslint-disable @typescript-eslint/no-explicit-any */
import { VideoQuestionData } from "@/lib/types/survey";

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

      <div className="space-y-3 mt-4 mb-2">
        <span className="inline-block bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
          QUESTION
        </span>
        <h2 className="text-xl md:text-2xl font-bold font-heading leading-snug text-secondary-foreground">
          {question.question}
        </h2>
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
                  ? "bg-background border-green-500 border-2 shadow-sm font-semibold text-foreground"
                  : "bg-background border-border hover:border-primary/50 text-muted-foreground"
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
