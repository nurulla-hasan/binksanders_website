import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CreateModuleFormValues,
  QuestionDataSchemaType,
} from "@/lib/validations/course";

interface QuestionBlockProps {
  question: QuestionDataSchemaType;
  index: number;
  onChangeType: (
    id: string,
    newType: QuestionDataSchemaType["type"],
  ) => void;
  onDelete: () => void;
}

const questionTypes: QuestionDataSchemaType["type"][] = [
  "MCQ",
  "Swipe",
  "Ordering",
  "Chat Scenario",
  "Video",
  "Rating",
];

export function QuestionBlock({
  question,
  index,
  onChangeType,
  onDelete,
}: QuestionBlockProps) {
  const { control, register } = useFormContext<CreateModuleFormValues>();
  const currentQuestion = useWatch({
    control,
    name: `questions.${index}`,
  }) as QuestionDataSchemaType;

  return (
    <div className="space-y-6 rounded-md border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <Field>
          <FieldLabel htmlFor={`question-${question.id}`}>Content</FieldLabel>
          <Input
            id={`question-${question.id}`}
            placeholder="Question or instruction"
            {...register(`questions.${index}.content`)}
          />
        </Field>
        <Field>
          <FieldLabel>Question Type</FieldLabel>
          <Select
            value={currentQuestion.type}
            onValueChange={(value) =>
              onChangeType(
                question.id,
                value as QuestionDataSchemaType["type"],
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {currentQuestion.type === "MCQ" && (
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-3">
            {currentQuestion.options.map((_, optionIndex) => (
              <Field key={optionIndex}>
                <FieldLabel>Option {optionIndex + 1}</FieldLabel>
                <Input
                  {...register(
                    `questions.${index}.options.${optionIndex}` as const,
                  )}
                />
              </Field>
            ))}
          </div>
          <Field>
            <FieldLabel>Correct Answer</FieldLabel>
            <Controller
              control={control}
              name={`questions.${index}.correctAnswer`}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentQuestion.options
                      .filter(Boolean)
                      .map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field>
            <FieldLabel>Explanation</FieldLabel>
            <Input {...register(`questions.${index}.explanation`)} />
          </Field>
        </FieldGroup>
      )}

      {currentQuestion.type === "Swipe" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel>Left Label</FieldLabel>
            <Input {...register(`questions.${index}.leftLabel`)} />
          </Field>
          <Field>
            <FieldLabel>Right Label</FieldLabel>
            <Input {...register(`questions.${index}.rightLabel`)} />
          </Field>
          <Field>
            <FieldLabel>Correct Direction</FieldLabel>
            <Controller
              control={control}
              name={`questions.${index}.correctDirection`}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      )}

      {currentQuestion.type === "Ordering" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {currentQuestion.items.map((_, itemIndex) => (
            <Field key={itemIndex}>
              <FieldLabel>Item {itemIndex + 1}</FieldLabel>
              <Input
                {...register(`questions.${index}.items.${itemIndex}` as const)}
              />
            </Field>
          ))}
        </div>
      )}

      {currentQuestion.type === "Chat Scenario" && (
        <div className="space-y-4">
          {currentQuestion.messages.map((_, messageIndex) => (
            <div key={messageIndex} className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel>Sender</FieldLabel>
                <Input
                  {...register(
                    `questions.${index}.messages.${messageIndex}.sender` as const,
                  )}
                />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel>Message</FieldLabel>
                <Input
                  {...register(
                    `questions.${index}.messages.${messageIndex}.text` as const,
                  )}
                />
              </Field>
            </div>
          ))}
        </div>
      )}

      {currentQuestion.type === "Video" && (
        <Field>
          <FieldLabel>Video URL</FieldLabel>
          <Input
            type="url"
            placeholder="https://example.com/video.mp4"
            {...register(`questions.${index}.videoUrl`)}
          />
        </Field>
      )}

      {currentQuestion.type === "Rating" && (
        <Field>
          <FieldLabel>Rating Scale</FieldLabel>
          <Input
            type="number"
            min={2}
            max={10}
            {...register(`questions.${index}.scale`, { valueAsNumber: true })}
          />
        </Field>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Field orientation="horizontal">
          <Controller
            control={control}
            name={`questions.${index}.isScored`}
            render={({ field }) => (
              <Checkbox
                id={`scored-${question.id}`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldLabel htmlFor={`scored-${question.id}`}>Scored question</FieldLabel>
        </Field>
        <Button type="button" variant="destructive" onClick={onDelete}>
          <Trash2 /> Delete
        </Button>
      </div>
    </div>
  );
}
