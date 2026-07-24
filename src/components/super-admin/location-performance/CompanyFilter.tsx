"use client";

import type { CompanyDropdownItem } from "@/lib/types/company.type";
import { useNextFilter } from "@/hooks/useNextFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CompanyFilter({ companies }: { companies: CompanyDropdownItem[] }) {
  const { getFilter, updateFilter } = useNextFilter<"companyId">();

  return (
    <Select
      value={getFilter("companyId", "all")}
      onValueChange={(value) => updateFilter("companyId", value === "all" ? "" : value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="All companies" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All companies</SelectItem>
        {companies.map((company) => (
          <SelectItem
            key={company._id}
            value={company._id}
          >
            {company.firstName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
