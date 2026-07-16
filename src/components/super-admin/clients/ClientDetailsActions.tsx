"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Ban, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { EditBrandingModal } from "@/components/super-admin/clients/EditBrandingModal";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Company, CompanyPayload } from "@/lib/types/company.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import {
  deleteCompany,
  updateCompany,
  updateCompanyStatus,
} from "@/services/company.service";

export function ClientDetailsActions({ company }: { company: Company }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<"edit" | "status" | "delete">();
  const [form, setForm] = useState<CompanyPayload>({
    name: company.name,
    email: company.email,
    address: company.address,
  });
  const isActive = company.status === "active";

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveAction("edit");

    try {
      const response = await updateCompany(company._id, form);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Company updated successfully");
      setEditOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to update company");
    } finally {
      setActiveAction(undefined);
    }
  };

  const handleStatus = async () => {
    setActiveAction("status");

    try {
      const response = await updateCompanyStatus(
        company._id,
        isActive ? "inactive" : "active",
      );
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Company status updated");
      setStatusOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to update status");
    } finally {
      setActiveAction(undefined);
    }
  };

  const handleDelete = async () => {
    setActiveAction("delete");

    try {
      const response = await deleteCompany(company._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Company deleted successfully");
      router.replace("/super-admin/clients");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to delete company");
      setActiveAction(undefined);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <EditBrandingModal company={company} />
      <ModalWrapper
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Company"
        description="Update the client's basic information."
        actionTrigger={
          <Button type="button" variant="outline">
            <Pencil /> Edit
          </Button>
        }
      >
        <form onSubmit={handleEdit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
              <Input id="companyName" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="companyEmail">Email</FieldLabel>
              <Input id="companyEmail" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="companyAddress">Address</FieldLabel>
              <Input id="companyAddress" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={activeAction === "edit"}>{activeAction === "edit" ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </ModalWrapper>

      <ConfirmationModal
        open={statusOpen}
        onOpenChange={setStatusOpen}
        title={`${isActive ? "Deactivate" : "Activate"} company?`}
        description={`Are you sure you want to ${isActive ? "deactivate" : "activate"} ${company.name}?`}
        confirmText={isActive ? "Deactivate" : "Activate"}
        loadingText="Updating..."
        onConfirm={handleStatus}
        isLoading={activeAction === "status"}
        variant={isActive ? "destructive" : "default"}
        actionTrigger={
          <Button type="button" variant="outline">
            {isActive ? <Ban /> : <ShieldCheck />}
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        }
      />

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete company?"
        description={`Are you sure you want to delete ${company.name}? This action cannot be undone.`}
        confirmText="Delete"
        loadingText="Deleting..."
        onConfirm={handleDelete}
        isLoading={activeAction === "delete"}
        variant="destructive"
        actionTrigger={
          <Button type="button" variant="destructive">
            <Trash2 /> Delete
          </Button>
        }
      />
    </div>
  );
}
