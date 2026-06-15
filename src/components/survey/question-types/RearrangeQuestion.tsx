/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { RearrangeQuestionData } from "@/types/survey";
import { Button } from "@/components/ui/button";

interface RearrangeQuestionProps {
  question: RearrangeQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function RearrangeQuestion({ question, answerData, onAnswer }: RearrangeQuestionProps) {
  // If no answerData exists yet, initialize it with the original items
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (!answerData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(question.items);
      // Immediately pass initial state up so "Next" could theoretically be clicked 
      // if they don't want to change the default order.
      onAnswer(question.items.map(i => i.id));
    } else if (Array.isArray(answerData)) {
      // Restore ordered items from IDs
      const ordered = answerData.map(id => question.items.find(i => i.id === id)!).filter(Boolean);
      setItems(ordered);
    }
  }, [question, answerData, onAnswer]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    onAnswer(newItems.map(i => i.id));
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    onAnswer(newItems.map(i => i.id));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div 
          layout
          key={item.id}
          className="flex items-center gap-3 bg-background border border-border/60 p-3 rounded-lg shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 rounded bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
              disabled={index === 0}
              onClick={() => moveUp(index)}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 rounded bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
              disabled={index === items.length - 1}
              onClick={() => moveDown(index)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="shrink-0 w-8 h-8 flex items-center justify-center font-bold text-sm bg-muted text-muted-foreground rounded-lg">
            {index + 1}
          </div>
          
          <span className="text-sm text-foreground leading-relaxed flex-1">
            {item.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
