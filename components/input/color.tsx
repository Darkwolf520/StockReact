"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { FormInputItem } from "@/components/input/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormColorInputItemProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder: string;
  pickerDefault: string;
  pickerLabel: string;
  clearLabel?: string;
};

export function FormColorInputItem<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  pickerDefault,
  pickerLabel,
  clearLabel = "Clear",
}: FormColorInputItemProps<TFieldValues, TName>) {
  return (
    <div className="flex gap-4 items-end w-fit">
      <FormInputItem
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        className="min-w-[120px]"
      />
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="shrink-0">
            <FormLabel className="sr-only">{pickerLabel}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-10 cursor-pointer rounded border border-input p-0.5"
                  value={(field.value as string) || pickerDefault}
                  onChange={(event) => field.onChange(event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange("")}
                >
                  {clearLabel}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
