"use client";

import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BroadcastPage() {
  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="Broadcast System" 
          description="Send real-time popup notifications globally to all active learners or target specific companies"
        >
          <Button>
            Send Broadcast Now
          </Button>
        </DashboardHeader>

        <div className="max-w-4xl">
          <Tabs defaultValue="global" className="w-full">
            <TabsList>
              <TabsTrigger 
                value="global"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Global (All Clients)
              </TabsTrigger>
              <TabsTrigger 
                value="targeted"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Targeted (Specific Company)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="mt-2">
              <div className="bg-secondary/10 border border-secondary/20 rounded-md p-4 space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="global-title" className="text-sm font-medium text-foreground">
                    Notification Title
                  </label>
                  <Input id="global-title" placeholder="Type here.."  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="global-body" className="text-sm font-medium text-foreground">
                    Message Body
                  </label>
                  <Textarea id="global-body" placeholder="Type here.." className="min-h-[160px] resize-none" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="targeted" className="mt-2">
              <div className="bg-secondary/10 border border-secondary/20 rounded-md p-4 space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="company" className="text-sm font-medium text-foreground">
                    Select Client Company
                  </label>
                  <Select defaultValue="unilever">
                    <SelectTrigger id="company" className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unilever">Unilever</SelectItem>
                      <SelectItem value="acme">Acme Corp</SelectItem>
                      <SelectItem value="globex">Globex Inc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="targeted-title" className="text-sm font-medium text-foreground">
                    Notification Title
                  </label>
                  <Input id="targeted-title" placeholder="Type here.."  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="targeted-body" className="text-sm font-medium text-foreground">
                    Message Body
                  </label>
                  <Textarea id="targeted-body" placeholder="Type here.." className="min-h-[160px] resize-none" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardPageLayout>
    </div>
  );
}
