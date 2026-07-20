"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuestionBlock } from "./QuestionBlock";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreateModuleFormValues, getDefaultQuestionValues, QuestionDataSchemaType } from "@/lib/validations/course";

export function QuestionnaireSection() {
  const { control } = useFormContext<CreateModuleFormValues>();
  
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    append(getDefaultQuestionValues("MCQ", newId));
  };

  const changeQuestionType = (
    index: number,
    id: string,
    newType: QuestionDataSchemaType["type"],
  ) => {
    update(index, getDefaultQuestionValues(newType, id));
  };

  const deleteQuestion = (index: number) => {
    remove(index);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Create Questionnaire</h2>
        <Button type="button" onClick={addQuestion} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Question
        </Button>
      </div>

      <div className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center p-8 border rounded-md border-dashed text-muted-foreground">
            No questions added yet. Click &quot;Add New Question&quot; to begin.
          </div>
        ) : (
          fields.map((field, index) => (
            <QuestionBlock 
              key={field.id} // use the id provided by useFieldArray or our own id
              question={field as QuestionDataSchemaType}
              index={index}
              onChangeType={(id, newType) => changeQuestionType(index, id, newType)}
              onDelete={() => deleteQuestion(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}
