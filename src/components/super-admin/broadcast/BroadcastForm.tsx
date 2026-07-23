"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CompanyDropdownItem } from "@/lib/types/company.type";
import type { CompanyBroadcastPayload } from "@/lib/types/notification.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { broadcastToCompanies } from "@/services/notification.service";

type BroadcastTarget = "global" | "targeted";

export function BroadcastForm({
  companies,
}: {
  companies: CompanyDropdownItem[];
}) {
  const [targetType, setTargetType] = useState<BroadcastTarget>("global");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !message.trim()) {
      ErrorToast("Title and message are required");
      return;
    }

    if (targetType === "targeted" && !companyId) {
      ErrorToast("Please select a client company");
      return;
    }

    const payload: CompanyBroadcastPayload =
      targetType === "global"
        ? { title: title.trim(), message: message.trim(), targetType: "global" }
        : {
            title: title.trim(),
            message: message.trim(),
            targetType: "targeted",
            companyId,
          };

    setIsPending(true);

    try {
      const response = await broadcastToCompanies(payload);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Broadcast sent successfully");
      setTitle("");
      setMessage("");
      setCompanyId("");
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to send broadcast");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn space-y-6">
      <DashboardHeader
        title="Broadcast System"
        description="Send real-time notifications globally or to a specific client company."
      >
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send Broadcast Now"}
        </Button>
      </DashboardHeader>

      <div className="max-w-4xl">
        <Tabs
          value={targetType}
          onValueChange={(value) => setTargetType(value as BroadcastTarget)}
        >
          <TabsList variant="default">
            <TabsTrigger value="global">
              <span className="sm:hidden">Global (All Clients)</span>
              <span className="hidden sm:inline">Global (All Clients)</span>
            </TabsTrigger>
            <TabsTrigger value="targeted">
              <span className="sm:hidden">Targeted (Specific)</span>
              <span className="hidden sm:inline">Targeted (Specific Company)</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-2 rounded-md border border-border bg-card p-4 shadow-sm">
            <TabsContent value="global">
              <BroadcastFields
                prefix="global"
                title={title}
                message={message}
                onTitleChange={setTitle}
                onMessageChange={setMessage}
              />
            </TabsContent>

            <TabsContent value="targeted">
              <FieldGroup>
                <Field>
                  <FieldLabel>Client Company</FieldLabel>
                  <Select value={companyId} onValueChange={setCompanyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.companyId || company._id}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <BroadcastFields
                  prefix="targeted"
                  title={title}
                  message={message}
                  onTitleChange={setTitle}
                  onMessageChange={setMessage}
                />
              </FieldGroup>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </form>
  );
}

function BroadcastFields({
  prefix,
  title,
  message,
  onTitleChange,
  onMessageChange,
}: {
  prefix: string;
  title: string;
  message: string;
  onTitleChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${prefix}-title`}>Notification Title</FieldLabel>
        <Input
          id={`${prefix}-title`}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Type here..."
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}-message`}>Message Body</FieldLabel>
        <Textarea
          id={`${prefix}-message`}
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Type here..."
          className="min-h-40 resize-none"
          required
        />
      </Field>
    </FieldGroup>
  );
}
