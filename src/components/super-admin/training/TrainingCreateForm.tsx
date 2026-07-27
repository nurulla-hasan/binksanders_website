"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PublicCompanyDropdownItem } from "@/lib/types/company.type";
import type { Team } from "@/lib/types/team.type";
import type { Training, TrainingAuthType, TrainingStatus } from "@/lib/types/training.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { createTraining } from "@/services/training.service";

type TrainingCreateFormProps = {
  companies: PublicCompanyDropdownItem[];
  teams: Team[];
};

const authTypes: TrainingAuthType[] = ["passcode", "email", "employeeId", "guest"];
const statuses: TrainingStatus[] = ["draft", "published"];

export function TrainingCreateForm({ companies, teams }: TrainingCreateFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [authType, setAuthType] = useState<TrainingAuthType>("passcode");
  const [status, setStatus] = useState<TrainingStatus>("draft");

  const filteredTeams = useMemo(
    () => teams.filter((team) => !companyId || team.companyId === companyId),
    [companyId, teams],
  );

  const handleCompanyChange = (value: string) => {
    setCompanyId(value);
    setTeamId("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const passcode = String(formData.get("passcode") || "").trim();
    const thumbnail = formData.get("thumbnail");

    if (!title || !description) {
      ErrorToast("Title and description are required");
      return;
    }

    if (!companyId || !teamId) {
      ErrorToast("Select a company and team");
      return;
    }

    if (authType === "passcode" && !passcode) {
      ErrorToast("Passcode is required for passcode auth");
      return;
    }

    setIsPending(true);

    try {
      const response = await createTraining<Training>({
        data: {
          title,
          description,
          companyId,
          teamId,
          authType,
          status,
          ...(authType === "passcode" ? { passcode } : {}),
        },
        thumbnailImage:
          thumbnail instanceof File && thumbnail.size > 0 ? thumbnail : undefined,
      });

      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Training created successfully");
      router.replace(`/super-admin/training/${response.data._id}`);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to create training");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" name="title" placeholder="Customer Service Excellence" />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={status} onValueChange={(value) => setStatus(value as TrainingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" placeholder="Short training summary" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Company</FieldLabel>
            <Select value={companyId} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Team</FieldLabel>
            <Select value={teamId} onValueChange={setTeamId} disabled={!companyId}>
              <SelectTrigger>
                <SelectValue placeholder={companyId ? "Select team" : "Select company first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredTeams.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Auth Type</FieldLabel>
            <Select value={authType} onValueChange={(value) => setAuthType(value as TrainingAuthType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {authTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="passcode">Passcode</FieldLabel>
            <Input
              id="passcode"
              name="passcode"
              placeholder="12345"
              disabled={authType !== "passcode"}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
          <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save /> {isPending ? "Creating..." : "Create Training"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}