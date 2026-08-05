import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { useFormContext } from "react-hook-form";
import { CreateModuleFormValues } from "@/lib/validations/course";

export function ModuleBasicInfo({
  existingThumbnail,
  allowThumbnail = true,
}: {
  existingThumbnail?: string;
  allowThumbnail?: boolean;
}) {
  const { register, setValue } = useFormContext<CreateModuleFormValues>();
  const [preview, setPreview] = useState<string | null>(
    existingThumbnail || null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("thumbnail", file);
    }
  };

  return (
    <div className="space-y-6 rounded-md border border-secondary/20 bg-secondary/30 p-6">
      <Field>
        <FieldLabel htmlFor="module-title">Module Title</FieldLabel>
        <Input
          id="module-title"
          placeholder="Course Title"
          {...register("title")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="module-desc">Description</FieldLabel>
        <Input
          id="module-desc"
          placeholder="Course Description"
          {...register("description")}
        />
      </Field>

      {allowThumbnail && (
        <Field>
          <FieldLabel>Thumbnail Image</FieldLabel>
          <label className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-secondary/40 bg-background/50 transition-colors hover:bg-background">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Upload here..</span>
                </div>
              </div>
            )}
          </label>
          <p className="text-xs text-muted-foreground">
            Recommended: 1280 × 720 px (16:9), JPG or PNG. Keep important
            content near the centre for consistent module cards.
          </p>
        </Field>
      )}
    </div>
  );
}
