/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { SwipeQuestionData } from "@/lib/types/survey";
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
    ["rgba(239, 68, 68, 0.6)", "rgba(0, 0, 0, 0)", "rgba(34, 197, 94, 0.6)"]
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
    <div className="flex-1 flex flex-col relative w-full min-h-87.5 mb-20">
      


      {/* Draggable Card */}
      <motion.div
        drag={!hasSwiped ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        animate={controls}
        className="absolute inset-0 bg-background border border-primary/20 rounded-lg flex flex-col justify-center shadow-md cursor-grab active:cursor-grabbing z-10 overflow-hidden"
      >
        {/* Color Overlay for swipe feedback */}
        <motion.div 
          className="absolute inset-0 pointer-events-none" 
          style={{ backgroundColor }} 
        />
        
        <div className="relative z-10 p-8 flex flex-col justify-center items-center h-full">
          <h3 className="text-[22px] md:text-2xl font-bold font-heading text-center leading-snug text-foreground w-full">
            {question.statement}
          </h3>
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center text-foreground/70 text-sm gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Swipe to respond</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {/* Static Buttons at Bottom */}
      <div className="absolute -bottom-20 w-full flex justify-between gap-4 z-20">
        <Button 
          variant="disagree"
          size={"lg"} 
          disabled={hasSwiped}
          className="flex-1 font-bold tracking-wide"
          onClick={() => handleButtonClick('left')}
        >
          <X className="stroke-3" /> DISAGREE
        </Button>
        <Button 
          variant="agree"
          size={"lg"} 
          disabled={hasSwiped}
          className="flex-1 font-bold tracking-wide"
          onClick={() => handleButtonClick('right')}
        >
          <Check className="stroke-3" /> AGREE
        </Button>
      </div>
    </div>
  );
}
