import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { UserData } from "@/app/(admin-route)/company/users/page";

interface UserDetailModalProps {
  user: UserData;
}

type ModuleData = {
  id: string;
  index: string;
  title: string;
  score: number;
  completedDate: string;
  question: string;
  answer: string;
};

// Mock data for user's modules
const MOCK_MODULES: ModuleData[] = [
  {
    id: "m1",
    index: "01",
    title: "Fire Safety & Evacuation",
    score: 95,
    completedDate: "May 15, 2026",
    question: "What evacuation improvement would you suggest for your floor?",
    answer: "The emergency exit doors on the second floor are sometimes partially blocked by empty delivery boxes. We need a strict policy that no boxes should ever be left near these exit paths.",
  },
  {
    id: "m2",
    index: "02",
    title: "Fire Safety & Evacuation",
    score: 95,
    completedDate: "May 16, 2026",
    question: "How frequently should fire drills be conducted?",
    answer: "At least twice a year to ensure everyone is familiar with the escape routes.",
  },
];

export function UserDetailModal({ user }: UserDetailModalProps) {
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedModule(null);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background border-none gap-0">

        {/* We use a visually hidden title for accessibility to avoid warning */}
        <DialogTitle className="sr-only">User Details</DialogTitle>

        {/* Custom Header with Close Button */}
        <div className="flex justify-between items-center p-4">
          {selectedModule ? (
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          ) : (
            <div className="h-5" /> // Spacer if no back button
          )}
        </div>

        {/* View 1: User Overview */}
        {!selectedModule && (
          <div className="px-8 pb-8 flex flex-col items-center animate-in slide-in-from-left-4 fade-in duration-300">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarFallback className="text-3xl bg-primary/10 text-primary uppercase">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left space-y-2 mt-2 sm:mt-0">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                      <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5V11.5C1 11.7761 1.22386 12 1.5 12H13.5C13.7761 12 14 11.7761 14 11.5V3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM2 4.15049L7.1444 7.64094C7.35925 7.78663 7.64075 7.78663 7.8556 7.64094L13 4.15049V11H2V4.15049ZM12.3556 4L7.5 7.29415L2.6444 4H12.3556Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                    {user.emailOrId}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                      <path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.08578 7.91414 3.74999 7.49992 3.74999C7.08571 3.74999 6.74992 4.08578 6.74992 4.49999V7.50004C6.74992 7.69896 6.82894 7.88972 6.96963 8.03042L9.09096 10.1517C9.38385 10.4446 9.85873 10.4446 10.1516 10.1517C10.4445 9.85885 10.4445 9.38398 10.1516 9.09108L8.24992 7.18941V4.49999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                    Joined recently
                  </span>
                </div>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              {/* Total Points */}
              <div className="bg-secondary/10 border border-secondary/20 rounded-md p-4 flex flex-col justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Points</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{user.points}</span>
                  <span className="text-xs text-muted-foreground font-medium">pts</span>
                </div>
              </div>

              {/* Assigned Modules */}
              <div className="bg-primary/10 border border-primary/20 rounded-md p-4 flex flex-col justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assigned Modules</span>
                <span className="text-3xl font-bold text-foreground">{MOCK_MODULES.length}</span>
              </div>
            </div>

            {/* Modules List */}
            <div className="w-full flex flex-col gap-3">
              {MOCK_MODULES.map((mod) => (
                <div key={mod.id} className="flex items-center justify-between bg-muted/30 border border-border/50 rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-sm">
                      {mod.index}
                    </span>
                    <span className="text-sm font-semibold">{mod.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{mod.score}%</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-muted hover:bg-muted/80 text-muted-foreground"
                      onClick={() => setSelectedModule(mod)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 2: Module Detail */}
        {selectedModule && (
          <div className="px-8 pb-8 flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-xl font-bold uppercase tracking-wide text-foreground mb-1">
              {selectedModule.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Completed on {selectedModule.completedDate} <span className="mx-1">|</span> Score: {selectedModule.score}%
            </p>

            <div className="bg-muted/30 rounded-md p-5 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-4 leading-relaxed">
                {selectedModule.question}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Answer :</span>{selectedModule.answer}
              </p>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
