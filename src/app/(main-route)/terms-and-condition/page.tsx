
import { getTerms } from "@/services/cms.service";

export default async function TermsConditionPage() {
  const response = await getTerms();

  if (!response.success) {
    throw new Error(response.message || "Unable to load terms and conditions");
  }

  return (
    <div className="flex-1 flex flex-col animate-fadeIn pb-18">
      <div
        className="prose prose-sm dark:prose-invert max-w-none text-foreground/80"
        dangerouslySetInnerHTML={{ __html: response.data.termsCondition }}
      />
    </div>
  );
}
