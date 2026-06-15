/* eslint-disable @typescript-eslint/no-explicit-any */
import { SurveyQuestionType } from "@/types/survey";
import { SwipeQuestion } from "./question-types/SwipeQuestion";
import { ChatQuestion } from "./question-types/ChatQuestion";
import { RearrangeQuestion } from "./question-types/RearrangeQuestion";
import { VideoQuestion } from "./question-types/VideoQuestion";
import { TextQuestion } from "./question-types/TextQuestion";
import { MultipleChoiceQuestion } from "./question-types/MultipleChoiceQuestion";

interface SurveyQuestionCardProps {
  question: SurveyQuestionType;
  answerData: any;
  onAnswer: (val: any) => void;
}

export function SurveyQuestionCard({
  question,
  answerData,
  onAnswer,
}: SurveyQuestionCardProps) {
  
  // Render the specific question type component
  const renderQuestion = () => {
    switch (question.type) {
      case "swipe":
        return <SwipeQuestion question={question} answerData={answerData} onAnswer={onAnswer} />;
      case "chat":
        return <ChatQuestion question={question} answerData={answerData} onAnswer={onAnswer} />;
      case "rearrange":
        return <RearrangeQuestion question={question} answerData={answerData} onAnswer={onAnswer} />;
      case "video":
        return <VideoQuestion question={question} answerData={answerData} onAnswer={onAnswer} />;
      case "text":
        return <TextQuestion question={question as any} answerData={answerData} onAnswer={onAnswer} />;
      case "multiple-choice":
        return <MultipleChoiceQuestion question={question as any} answerData={answerData} onAnswer={onAnswer} />;
      default:
        return <div>Unsupported question type.</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col mt-4" key={question.id}>
      {renderQuestion()}
    </div>
  );
}
