import type { ProjectFormValues } from "@/lib/types";
import { projectFormCopy } from "@/lib/copy/project-form-copy";

export type ProjectFormField = {
  key: keyof ProjectFormValues;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  helper?: string;
  validationMessage?: string;
};

export const projectFormFields: ProjectFormField[] = [
  {
    key: "docTitle",
    ...projectFormCopy.docTitle,
    required: true,
  },
  {
    key: "industry",
    ...projectFormCopy.industry,
    required: true,
  },
  {
    key: "systemType",
    ...projectFormCopy.systemType,
    required: true,
  },
  {
    key: "purpose",
    ...projectFormCopy.purpose,
    required: true,
    multiline: true,
  },
  {
    key: "background",
    ...projectFormCopy.background,
    multiline: true,
  },
  {
    key: "goals",
    ...projectFormCopy.goals,
    multiline: true,
  },
  {
    key: "inScope",
    ...projectFormCopy.inScope,
    multiline: true,
  },
  {
    key: "outScope",
    ...projectFormCopy.outScope,
    multiline: true,
  },
  {
    key: "assumptions",
    ...projectFormCopy.assumptions,
    multiline: true,
  },
  {
    key: "constraints",
    ...projectFormCopy.constraints,
    multiline: true,
  },
  {
    key: "rolesText",
    ...projectFormCopy.rolesText,
    multiline: true,
  },
  {
    key: "minutesText",
    ...projectFormCopy.minutesText,
    required: true,
    multiline: true,
  },
];
