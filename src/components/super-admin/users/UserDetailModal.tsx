import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { UserData } from "@/app/(admin-route)/super-admin/users/page";

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
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-md mb-3">
                <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              {/* Total Completed */}
              <div className="bg-secondary/10 border border-secondary/20 rounded-md p-4 flex flex-col justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Completed</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">4/6</span>
                  <span className="text-xs text-muted-foreground font-medium">modules</span>
                </div>
              </div>

              {/* Total Points */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex flex-col justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Points</span>
                <span className="text-3xl font-bold text-foreground">{user.points}</span>
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
