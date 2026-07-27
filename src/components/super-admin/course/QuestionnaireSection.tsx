"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuestionBlock } from "./QuestionBlock";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreateModuleFormValues, getDefaultQuestionValues, QuestionDataSchemaType } from "@/lib/validations/course";

import { AnimatePresence } from "framer-motion";
import AnimationWrapper from "@/components/ui/custom/animation-wrapper";

export function QuestionnaireSection() {
  const { control } = useFormContext<CreateModuleFormValues>();
  
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    append(getDefaultQuestionValues("Information", newId));
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
    <div className="mt-8">
      <div className="sticky top-0 z-20 -mt-4 bg-background/95 px-4 py-4 backdrop-blur-sm sm:flex sm:items-center sm:justify-between border-b shadow-sm mb-6">
        <h2 className="text-xl font-bold text-foreground">Create Questionnaire</h2>
        <Button type="button" onClick={addQuestion} className="mt-3 flex w-full items-center gap-2 sm:mt-0 sm:w-auto shadow-md hover:shadow-lg transition-all">
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
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <AnimationWrapper key={field.id} direction="up" duration={0.3}>
                <QuestionBlock 
                  question={field as QuestionDataSchemaType}
                  index={index}
                  onChangeType={(id, newType) => changeQuestionType(index, id, newType)}
                  onDelete={() => deleteQuestion(index)}
                />
              </AnimationWrapper>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

