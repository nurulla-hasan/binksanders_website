import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Leaderboard() {
  const leaderboardData = [
    { id: "01", name: "SARAH JENKINS", points: 950, isTop: true },
    { id: "02", name: "MARK DE VRIES", points: 950 },
    { id: "03", name: "JEROEN BAKKER", points: 950 },
    { id: "04", name: "ANNA COOPER", points: 950 },
    { id: "05", name: "NM SUJON", points: 950 },
    { id: "07", name: "NUR HASAN MASUM", points: 950 },
    { id: "08", name: "NURULLAH HASAN", points: 950 },
    { id: "09", name: "GONI", points: 950 },
    { id: "10", name: "SOUBIR SAIAN", points: 950 },
    { id: "12", name: "MOBAROK", points: 950 },
  ];

  return (
    <Card className="col-span-1 bg-secondary/10 border-none shadow-none h-full rounded-sm overflow-hidden flex flex-col pt-0">
      <CardHeader className="pt-5 pb-4 px-4 bg-secondary/20 border-b border-secondary/20">
        <CardTitle className="text-sm font-bold font-heading uppercase tracking-wide leading-tight">
          EMPLOYEE PERFORMANCE<br />LEADERBOARD
        </CardTitle>
      </CardHeader>
      <ScrollArea className="overflow-y-auto flex-1">
        <CardContent className="p-0">
          <div className="flex flex-col">
            {leaderboardData.map((user, i) => (
              <div
                key={user.id}
                className={`flex items-center justify-between py-3 px-4 hover:bg-secondary/20 transition-colors ${i !== leaderboardData.length - 1 ? 'border-b border-secondary/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-sm ${user.isTop ? 'bg-primary text-primary-foreground' : 'bg-secondary/30 text-secondary-foreground'}`}>
                    {user.id}
                  </span>
                  <span className="text-xs font-bold tracking-wide">{user.name}</span>
                </div>
                <div className="flex flex-col items-end leading-none">
                  <span className="text-sm font-bold">{user.points}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">pts</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
