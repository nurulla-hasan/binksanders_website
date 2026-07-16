import { CmsEditor } from "@/components/super-admin/cms/CmsEditor";
import { getTerms } from "@/services/cms.service";

export default async function TermsAndConditionsPage() {
  const response = await getTerms();

  if (!response.success) {
    throw new Error(response.message || "Unable to load terms and conditions");
  }

  return (
    <CmsEditor
      type="terms"
      title="Terms and Conditions"
      description="Manage and update the terms and conditions for your platform."
      initialContent={response.data.termsCondition}
      placeholder="Type your terms and conditions here..."
    />
  );
}
