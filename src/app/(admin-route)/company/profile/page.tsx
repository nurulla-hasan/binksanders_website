/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema as any),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    }
  });

  const onSubmit = (data: ProfileValues) => {
    console.log("Profile data:", data);
    // TODO: Connect this to an API endpoint
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="Company Profile" 
          description="Manage your company's public information and contact details."
        />

        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 shadow-sm max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-6">Company Information</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name" className="text-muted-foreground font-medium">Name</FieldLabel>
                  <FieldContent>
                    <Input 
                      id="name" 
                      placeholder="Type Here.." 
                      className="bg-transparent shadow-none h-11"
                      aria-invalid={!!errors.name} 
                      {...register("name")} 
                    />
                    <FieldError errors={[errors.name]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email" className="text-muted-foreground font-medium">Email</FieldLabel>
                  <FieldContent>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Type Here.." 
                      className="bg-transparent shadow-none h-11"
                      aria-invalid={!!errors.email} 
                      {...register("email")} 
                    />
                    <FieldError errors={[errors.email]} />
                  </FieldContent>
                </Field>
              </div>

              <Field data-invalid={!!errors.address}>
                <FieldLabel htmlFor="address" className="text-muted-foreground font-medium">Address</FieldLabel>
                <FieldContent>
                  <Input 
                    id="address" 
                    placeholder="Type Here.." 
                    className="bg-transparent shadow-none h-11"
                    aria-invalid={!!errors.address} 
                    {...register("address")} 
                  />
                  <FieldError errors={[errors.address]} />
                </FieldContent>
              </Field>
            </FieldGroup>

            <div className="flex justify-end pt-8">
              <Button type="submit">
                Publish
              </Button>
            </div>
          </form>
        </div>
      </DashboardPageLayout>
    </div>
  );
}
