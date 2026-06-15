/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { SwipeQuestionData } from "@/types/survey";
import { Button } from "@/components/ui/button";

interface SwipeQuestionProps {
  question: SwipeQuestionData;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function SwipeQuestion({ question, answerData, onAnswer }: SwipeQuestionProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [hasSwiped, setHasSwiped] = useState(!!answerData);

  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const backgroundColor = useTransform(
    x,
    [-150, 0, 150],
    ["rgba(239, 68, 68, 0.1)", "rgba(138, 205, 222, 0.2)", "rgba(34, 197, 94, 0.1)"]
  );

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      controls.start({ x: 300, opacity: 0, transition: { duration: 0.3 } });
      setHasSwiped(true);
      onAnswer('agree');
    } else if (info.offset.x < -100) {
      controls.start({ x: -300, opacity: 0, transition: { duration: 0.3 } });
      setHasSwiped(true);
      onAnswer('disagree');
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? 300 : -300;
    controls.start({ x: targetX, opacity: 0, transition: { duration: 0.3 } });
    setHasSwiped(true);
    onAnswer(direction === 'right' ? 'agree' : 'disagree');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full min-h-[350px] mb-[80px]">
      


      {/* Draggable Card */}
      <motion.div
        drag={!hasSwiped ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, backgroundColor }}
        animate={controls}
        className="absolute inset-0 bg-secondary border rounded-lg p-8 flex flex-col justify-center shadow-sm cursor-grab active:cursor-grabbing z-10"
      >
        <h3 className="text-[22px] md:text-2xl font-bold font-heading text-center leading-snug text-foreground">
          {question.statement}
        </h3>
        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center text-muted-foreground text-sm gap-2 opacity-60">
          <ArrowLeft className="w-4 h-4" />
          <span>Swipe to respond</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>

      {/* Static Buttons at Bottom */}
      <div className="absolute bottom-[-80px] w-full flex justify-between gap-4 z-20">
        <Button 
          variant="outline"
          size={"lg"} 
          disabled={hasSwiped}
          className="flex-1 border-pink-300 bg-pink-50/50 hover:bg-pink-100 text-pink-500 font-bold tracking-wide"
          onClick={() => handleButtonClick('left')}
        >
          <X className="stroke-3" /> DISAGREE
        </Button>
        <Button 
          variant="outline"
          size={"lg"} 
          disabled={hasSwiped}
          className="flex-1 border-green-300 bg-green-50/50 hover:bg-green-100 text-green-600 font-bold tracking-wide"
          onClick={() => handleButtonClick('right')}
        >
          <Check className="stroke-3" /> AGREE
        </Button>
      </div>
    </div>
  );
}
