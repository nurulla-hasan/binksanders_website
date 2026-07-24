"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNextFilter } from "@/hooks/useNextFilter";
import type { CompanyDropdownItem } from "@/lib/types/company.type";

export function BrandingCompanySelect({
  companies,
  value,
}: {
  companies: CompanyDropdownItem[];
  value?: string;
}) {
  const { updateFilter } = useNextFilter<"companyId">();

  return (
    <Select
      value={value || undefined}
      onValueChange={(companyId) => updateFilter("companyId", companyId)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Company" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company._id} value={company._id}>
            {company.firstName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
