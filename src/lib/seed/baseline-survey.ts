import { SurveyQuestionType } from "@/lib/types/survey";

export const baselineSurveyData: SurveyQuestionType[] = [
  // --- MULTIPLE CHOICE QUESTIONS (3) ---
  {
    id: 0,
    theme: "Initial Assessment",
    type: "multiple-choice",
    question: "What is the first step when you witness a workplace safety incident?",
    options: [
      { id: "A", text: "Ignore it — someone else will report" },
      { id: "B", text: "Report it to the immediate supervisor" },
      { id: "C", text: "Try to fix the hazard yourself immediately" },
      { id: "D", text: "Take photos and post them online" },
    ]
  },
  {
    id: 1,
    theme: "Fire Safety",
    type: "multiple-choice",
    question: "Which of the following is considered a primary fire hazard in an office?",
    options: [
      { id: "A", text: "Overloaded electrical power strips" },
      { id: "B", text: "Keeping fire doors closed" },
      { id: "C", text: "Using designated smoking areas outdoors" },
      { id: "D", text: "Unplugging chargers when not in use" },
    ]
  },
  {
    id: 3,
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

  // --- SWIPE QUESTIONS (3) ---
  {
    id: 3,
    theme: "Social Safety at Work",
    type: "swipe",
    question: "Swipe right to Agree, left to Disagree.",
    statement: "Everyone on the team feels respected regardless of their role."
  },
  {
    id: 4,
    theme: "Safety Protocol",
    type: "swipe",
    question: "Swipe right to Agree, left to Disagree.",
    statement: "I feel confident reporting a safety hazard to management."
  },

  // --- CHAT QUESTIONS (3) ---
  {
    id: 6,
    theme: "Social Safety at Work",
    type: "chat",
    question: "Choose Your Response",
    botMessage: "Hi, do you have a moment? I wanted to talk about something that happened in yesterday's meeting.",
    options: [
      { id: "opt1", text: "Of course, what's on your mind?" },
      { id: "opt2", text: "Not now, I'm busy." }
    ]
  },
  {
    id: 7,
    theme: "Difficult Conversations",
    type: "chat",
    question: "Choose Your Response",
    botMessage: "Hey, I noticed you seemed upset after our presentation. Did I say something wrong?",
    options: [
      { id: "opt1", text: "Let's discuss it, I think we can align better." },
      { id: "opt2", text: "No, everything is perfectly fine." }
    ]
  },

  // --- REARRANGE QUESTIONS (3) ---
  {
    id: 9,
    theme: "Incident Response",
    type: "rearrange",
    question: "Use the arrows to arrange these incident response steps in the correct order.",
    items: [
      { id: "step1", text: "Ensure the area is safe and no one is at immediate risk." },
      { id: "step2", text: "Provide or call for necessary first aid/medical help." },
      { id: "step3", text: "Report the incident to your immediate supervisor." },
      { id: "step4", text: "Fill out the official incident report form." }
    ]
  },
  {
    id: 10,
    theme: "Fire Extinguisher Use",
    type: "rearrange",
    question: "Arrange the steps for using a fire extinguisher (the PASS method) in order.",
    items: [
      { id: "pass1", text: "Pull the pin at the top of the extinguisher." },
      { id: "pass2", text: "Aim the nozzle at the base of the fire." },
      { id: "pass3", text: "Squeeze the trigger to discharge the agent." },
      { id: "pass4", text: "Sweep the nozzle side-to-side across the fire." }
    ]
  },

  // --- VIDEO QUESTIONS (3) ---
  {
    id: 12,
    theme: "Situational Awareness",
    type: "video",
    question: "At this point in the video, what would you do in this situation?",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    options: [
      { id: "v_opt1", text: "Speak up immediately" },
      { id: "v_opt2", text: "Wait to see what others do" },
      { id: "v_opt3", text: "Report it privately later" }
    ]
  },
  {
    id: 13,
    theme: "Hazard Identification",
    type: "video",
    question: "Watch the clip. Which critical hazard did the worker overlook?",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    options: [
      { id: "v2_opt1", text: "Lack of proper eye protection" },
      { id: "v2_opt2", text: "Unsecured ladder placement" },
      { id: "v2_opt3", text: "Working near electrical hazards" }
    ]
  },

  // --- TEXT QUESTIONS (3) ---
  {
    id: 15,
    theme: "Self Reflection",
    type: "text",
    question: "Think of a recent team interaction. What would you do differently now?",
  },
  {
    id: 16,
    theme: "Safety Speak-Up",
    type: "text",
    question: "Describe a situation in your career where you spoke up about safety, or explain what stopped you.",
  },
];
