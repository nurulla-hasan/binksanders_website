/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { ChatQuestionData } from "@/lib/types/survey";

interface ChatQuestionProps {
  question: ChatQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function ChatQuestion({ question, answerData, onAnswer }: ChatQuestionProps) {
  return (
    <div className="flex-1 flex flex-col w-full min-h-100">
      
      {/* Chat History Area */}
      <div className="flex-1 space-y-4 p-4 bg-muted/30 rounded-lg overflow-y-auto mb-4 border">
        
        {/* Bot Message */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 max-w-[85%]"
        >
          <div className="shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-primary/20 p-3 rounded-2xl rounded-tl-none text-sm text-foreground">
            {question.botMessage}
          </div>
        </motion.div>

        {/* User Response (if answered) */}
        {answerData && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex items-start gap-3 max-w-[85%] ml-auto justify-end"
          >
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none text-sm">
              {question.options.find(o => o.id === answerData)?.text || answerData}
            </div>
          </motion.div>
        )}
      </div>

      {/* Options Area */}
      <div className="bg-background rounded-lg border shadow-sm p-4 space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Choose Your Response
        </p>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            disabled={!!answerData}
            className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
              answerData === option.id 
                ? "bg-primary/10 border-primary font-semibold"
                : answerData 
                  ? "bg-muted/50 border-border/50 opacity-50 cursor-not-allowed"
                  : "bg-background hover:bg-muted/50 border-border/80"
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
