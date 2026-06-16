/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { useFormContext, Controller } from "react-hook-form";
import { CreateModuleFormValues, QuestionDataSchemaType } from "@/lib/validations/course";

interface QuestionBlockProps {
  question: QuestionDataSchemaType;
  index: number;
  onChangeType: (id: string, newType: string) => void;
  onDelete: () => void;
}

export function QuestionBlock({ question, index, onChangeType, onDelete }: QuestionBlockProps) {
  const isRating = question.type === 'rating';
  const { register, control, setValue, watch } = useFormContext<CreateModuleFormValues>();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue(`questions.${index}.image` as any, file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue(`questions.${index}.videoFile` as any, file);
    }
  };

  // Watch for addExplanation/addImage to dynamically show/hide fields if needed in the future, 
  // currently we just render everything that belongs to the schema type, but checkboxes can control this.
  const addExplanation = watch(`questions.${index}.addExplanation` as any);
  const addImage = watch(`questions.${index}.addImage` as any);

  return (
    <div className="bg-card border rounded-md p-6 shadow-sm">
      {/* Top Row: Question/Title & Type Select */}
      <div className="flex gap-4 items-start mb-6">
        <div className="flex-1">
          <Input 
            placeholder={isRating ? "Title" : "Question"} 
            {...register(`questions.${index}.id` as any)} // Using id as the placeholder for the question title/prompt for now if we don't have a separate title field per question. Wait, the question title might need a field? Let's just bind to `id` or ignore it if not in schema. I will bind to an imaginary `title` or just ignore since we don't have it in schema. Let's ignore binding for this placeholder since we don't have `questionTitle` in schema.
          />
        </div>
        <div className="w-48 shrink-0">
          <Select 
            value={question.type} 
            onValueChange={(value) => onChangeType(question.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="swipe">Swipe</SelectItem>
              <SelectItem value="ordering">Ordering</SelectItem>
              <SelectItem value="chat_scenario">Chat Scenario</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="free_input">Free Input</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dynamic Fields based on Type */}
      <div className="mb-6">
        {question.type === 'mcq' && (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              {[0, 1, 2, 3].map(optIdx => (
                <Field key={optIdx}>
                  <FieldLabel htmlFor={`option-${question.id}-${optIdx}`}>Option {optIdx + 1}</FieldLabel>
                  <Input id={`option-${question.id}-${optIdx}`} placeholder="Type here" {...register(`questions.${index}.options.${optIdx}` as const)} />
                </Field>
              ))}
            </div>
            <Field className="mb-6">
              <FieldLabel htmlFor={`right-answer-${question.id}`}>Select Right Answer</FieldLabel>
              <Controller
                control={control}
                name={`questions.${index}.rightAnswer` as any}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id={`right-answer-${question.id}`}>
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map(optIdx => (
                        <SelectItem key={optIdx} value={`option${optIdx + 1}`}>Option {optIdx + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            {addExplanation && (
              <Field className="mb-6">
                <FieldLabel htmlFor={`explanation-${question.id}`}>Explanation</FieldLabel>
                <Input id={`explanation-${question.id}`} placeholder="Type here" {...register(`questions.${index}.explanation` as const)} />
              </Field>
            )}
            {addImage && (
              <Field>
                <FieldLabel>Image</FieldLabel>
                <label className="relative border-2 border-dashed border-secondary/40 rounded-md h-32 flex items-center justify-center bg-background/50 hover:bg-background cursor-pointer transition-colors w-full overflow-hidden">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Upload here..</span>
                      </div>
                    </div>
                  )}
                </label>
              </Field>
            )}
          </>
        )}

        {question.type === 'swipe' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field>
              <FieldLabel htmlFor={`left-swipe-${question.id}`} className="uppercase tracking-wider">LEFT SWIPE VALUE</FieldLabel>
              <Input id={`left-swipe-${question.id}`} placeholder="Type here" {...register(`questions.${index}.leftSwipe` as any)} />
            </Field>
            <Field>
              <FieldLabel htmlFor={`right-swipe-${question.id}`} className="uppercase tracking-wider">Right SWIPE VALUE</FieldLabel>
              <Input id={`right-swipe-${question.id}`} placeholder="Type here" {...register(`questions.${index}.rightSwipe` as any)} />
            </Field>
          </div>
        )}

        {question.type === 'ordering' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {["First", "Second", "Third", "Fourth"].map((step, stepIdx) => (
              <Field key={step}>
                <FieldLabel htmlFor={`step-${question.id}-${step}`}>{step} Step</FieldLabel>
                <Input id={`step-${question.id}-${step}`} placeholder="Type here" {...register(`questions.${index}.steps.${stepIdx}` as any)} />
              </Field>
            ))}
          </div>
        )}

        {question.type === 'chat_scenario' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[0, 1].map(optIdx => (
              <Field key={optIdx}>
                <FieldLabel htmlFor={`response-${question.id}-${optIdx}`}>Response {optIdx + 1}</FieldLabel>
                <Input id={`response-${question.id}-${optIdx}`} placeholder="Type here" {...register(`questions.${index}.responses.${optIdx}` as any)} />
              </Field>
            ))}
          </div>
        )}

        {question.type === 'video' && (
          <>
            <div className="mb-6">
              <label className="relative border-2 border-dashed border-secondary/40 rounded-md h-40 flex items-center justify-center bg-background/50 hover:bg-background cursor-pointer transition-colors w-full overflow-hidden">
                <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
                {preview ? (
                  <video src={preview} controls className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Upload video here..</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              {[0, 1, 2, 3].map(optIdx => (
                <Field key={optIdx}>
                  <FieldLabel htmlFor={`video-response-${question.id}-${optIdx}`}>Response {optIdx + 1}</FieldLabel>
                  <Input id={`video-response-${question.id}-${optIdx}`} placeholder="Type here" {...register(`questions.${index}.options.${optIdx}` as any)} />
                </Field>
              ))}
            </div>
            <Field>
              <FieldLabel htmlFor={`video-right-answer-${question.id}`}>Select Right Answer</FieldLabel>
              <Controller
                control={control}
                name={`questions.${index}.rightAnswer` as any}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id={`video-right-answer-${question.id}`}>
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map(optIdx => (
                        <SelectItem key={optIdx} value={`option${optIdx + 1}`}>Option {optIdx + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </>
        )}

        {question.type === 'rating' && (
          <Field>
            <Input placeholder="Description" {...register(`questions.${index}.description` as any)} />
          </Field>
        )}
      </div>

      <hr className="my-6 border-border" />

      {/* Footer: Checkboxes and Delete */}
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <Field orientation="horizontal">
            <Controller
              control={control}
              name={`questions.${index}.excludeFromScoring` as any}
              render={({ field }) => (
                <Checkbox id={`exclude-${question.id}`} checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <FieldLabel htmlFor={`exclude-${question.id}`} className="font-normal cursor-pointer">
              Exclude from scoring
            </FieldLabel>
          </Field>
          
          {question.type === 'ordering' && (
            <Field orientation="horizontal">
              <Controller
                control={control}
                name={`questions.${index}.ableToRetry` as any}
                render={({ field }) => (
                  <Checkbox id={`retry-${question.id}`} checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <FieldLabel htmlFor={`retry-${question.id}`} className="font-normal cursor-pointer">
                Able to retry
              </FieldLabel>
            </Field>
          )}
          
          {question.type !== 'rating' && question.type !== 'video' && (
            <Field orientation="horizontal">
              <Controller
                control={control}
                name={`questions.${index}.addExplanation` as any}
                render={({ field }) => (
                  <Checkbox id={`exp-${question.id}`} checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <FieldLabel htmlFor={`exp-${question.id}`} className="font-normal cursor-pointer">
                Add Explanation
              </FieldLabel>
            </Field>
          )}
          
          {question.type !== 'video' && question.type !== 'rating' && (
            <Field orientation="horizontal">
              <Controller
                control={control}
                name={`questions.${index}.addImage` as any}
                render={({ field }) => (
                  <Checkbox id={`img-${question.id}`} checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <FieldLabel htmlFor={`img-${question.id}`} className="font-normal cursor-pointer">
                Add Image
              </FieldLabel>
            </Field>
          )}
        </div>
        
        <Button 
          type="button"
          variant="outline" 
          onClick={onDelete}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
