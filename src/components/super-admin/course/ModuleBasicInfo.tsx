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
    <div className="bg-secondary/10 border border-secondary/20 rounded-md p-6 space-y-6">
      {/* Module Title */}
      <Field>
        <FieldLabel htmlFor="module-title">
          Module Title
        </FieldLabel>
        <Input 
          id="module-title" 
          placeholder="Course Title" 
          {...register("title")}
        />
      </Field>

      {/* Description */}
      <Field>
        <FieldLabel htmlFor="module-desc">
          Description
        </FieldLabel>
        <Input 
          id="module-desc" 
          placeholder="Course Description" 
          {...register("description")}
        />
      </Field>

      {allowThumbnail && <Field>
        <FieldLabel>
          Thumbnail Image
        </FieldLabel>
        <label className="relative border-2 border-dashed border-secondary/40 rounded-md h-40 flex items-center justify-center bg-background/50 hover:bg-background cursor-pointer transition-colors w-full overflow-hidden">
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Upload here..</span>
              </div>
            </div>
          )}
        </label>
      </Field>}
    </div>
  );
}
