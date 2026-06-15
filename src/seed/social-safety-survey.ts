import { SurveyQuestionType } from "@/types/survey";

export const socialSafetySurveyData: SurveyQuestionType[] = [
  {
    id: 101,
    theme: "Social Safety at Work",
    type: "swipe",
    question: "Swipe right to Agree, left to Disagree.",
    statement: "Everyone on the team feels respected regardless of their role."
  },
  {
    id: 102,
    theme: "Conflict Resolution",
    type: "multiple-choice",
    question: "What is the best way to address an uncomfortable joke made by a colleague in a meeting?",
    options: [
      { id: "A", text: "Politely but firmly address it in the moment." },
      { id: "B", text: "Ignore it and hope it doesn't happen again." },
      { id: "C", text: "Complain to other coworkers secretly." },
      { id: "D", text: "Laugh it off to avoid awkwardness." }
    ],
    correctOptionId: "A",
    explanation: "Addressing the joke respectfully in the moment sets a clear boundary and reinforces a safe work environment without escalating the conflict."
  },
  {
    id: 103,
    theme: "Difficult Conversations",
    type: "chat",
    question: "Choose Your Response",
    botMessage: "Hey, I noticed you seemed upset after our presentation. Did I say something wrong?",
    options: [
      { id: "opt1", text: "Let's discuss it, I think we can align better." },
      { id: "opt2", text: "No, everything is perfectly fine." }
    ]
  },
  {
    id: 104,
    theme: "Reporting Issues",
    type: "rearrange",
    question: "Arrange the steps for reporting an unsafe social environment in order.",
    items: [
      { id: "step1", text: "Document the instances objectively." },
      { id: "step2", text: "Speak to your HR representative or manager." },
      { id: "step3", text: "Cooperate with the follow-up investigation." },
      { id: "step4", text: "Check in to see if the environment improves." }
    ]
  },
  {
    id: 105,
    theme: "Team Trust",
    type: "text",
    question: "What is one thing that would make you feel more psychologically safe in your team?",
  }
];
