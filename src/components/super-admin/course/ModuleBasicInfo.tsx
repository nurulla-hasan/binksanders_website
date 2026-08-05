import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateModuleFormValues } from "@/lib/validations/course";

export function ModuleBasicInfo({
  existingThumbnail,
}: {
  existingThumbnail?: string;
}) {
  const { register, setValue } = useFormContext<CreateModuleFormValues>();
  const [preview, setPreview] = useState<string | null>(
    existingThumbnail || null,
  );
  const [objectPreview, setObjectPreview] = useState<string>();

  useEffect(() => {
    return () => {
      if (objectPreview) URL.revokeObjectURL(objectPreview);
    };
  }, [objectPreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextPreview = URL.createObjectURL(file);

    setObjectPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextPreview;
    });
    setPreview(nextPreview);
    setValue("thumbnail", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
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

      <Field>
        <FieldLabel htmlFor="module-thumbnail">Thumbnail Image</FieldLabel>
        <label
          htmlFor="module-thumbnail"
          className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-secondary/40 bg-background/50 transition-colors hover:bg-background"
        >
          <input
            id="module-thumbnail"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Module thumbnail preview"
                className="h-full w-full object-contain"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/65 px-3 py-2 text-center text-xs font-medium text-white">
                Click to replace thumbnail
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5" />
                <span className="text-sm font-medium">Upload thumbnail</span>
              </div>
            </div>
          )}
        </label>
        <p className="text-xs text-muted-foreground">
          Recommended: 1280 × 720 px (16:9), JPG or PNG. Keep important content
          near the centre for consistent module cards.
        </p>
      </Field>
    </div>
  );
}
