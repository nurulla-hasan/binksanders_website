import { CmsEditor } from "@/components/super-admin/cms/CmsEditor";
import { getPrivacy } from "@/services/cms.service";

export default async function PrivacyPolicyPage() {
  const response = await getPrivacy();

  if (!response.success) {
    throw new Error(response.message || "Unable to load privacy policy");
  }

  return (
    <CmsEditor
      type="privacy"
      title="Privacy Policy"
      description="Manage and update the privacy policy for your platform."
      initialContent={response.data.privacyPolicy}
      placeholder="Type your privacy policy here..."
    />
  );
}
