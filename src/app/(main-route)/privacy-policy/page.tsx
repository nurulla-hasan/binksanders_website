
import { getPrivacy } from "@/services/cms.service";

export default async function PrivacyPolicyPage() {
  const response = await getPrivacy();

  if (!response.success) {
    throw new Error(response.message || "Unable to load privacy policy");
  }

  return (
    <div className="flex-1 flex flex-col animate-fadeIn pb-18">
      <div
        className="prose prose-sm dark:prose-invert max-w-none text-foreground/80"
        dangerouslySetInnerHTML={{ __html: response.data.privacyPolicy }}
      />
    </div>
  );
}
