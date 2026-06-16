/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";

const addAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AddAdminValues = z.infer<typeof addAdminSchema>;

export function AddAdminModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddAdminValues>({
    resolver: zodResolver(addAdminSchema as any),
  });

  const onSubmit = (data: AddAdminValues) => {
    console.log("New admin data:", data);
    // TODO: Connect this to an actual API endpoint to add an admin
    setIsOpen(false);
    reset();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add New Admin</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <Input 
                  id="name" 
                  placeholder="Enter admin name" 
                  aria-invalid={!!errors.name} 
                  {...register("name")} 
                />
                <FieldError errors={[errors.name]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter email address" 
                  aria-invalid={!!errors.email} 
                  {...register("email")} 
                />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldContent>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a password" 
                  aria-invalid={!!errors.password} 
                  {...register("password")} 
                />
                <FieldError errors={[errors.password]} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Admin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
