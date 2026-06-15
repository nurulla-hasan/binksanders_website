import { SurveyQuestionType } from "@/types/survey";

export const diversityInclusionData: SurveyQuestionType[] = [
  {
    id: 301,
    theme: "Inclusion",
    type: "swipe",
    question: "Do you agree with the following statement?",
    statement: "Everyone in my team has an equal opportunity to speak during meetings."
  },
  {
    id: 302,
    theme: "Diversity",
    type: "multiple-choice",
    question: "When a new project is assigned, how does the team distribute tasks?",
    options: [
      { id: "A", text: "Based solely on previous experience." },
      { id: "B", text: "We try to give everyone a chance to learn." },
      { id: "C", text: "The manager decides without team input." },
      { id: "D", text: "Whoever speaks up first gets the task." }
    ],
    correctOptionId: "B",
    explanation: "Providing opportunities for everyone to learn fosters a more inclusive and diverse skill set within the team."
  },
  {
    id: 303,
    theme: "Belonging",
    type: "text",
    question: "What is one thing that would make you feel more valued here?",
  }
];
