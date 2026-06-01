import type { ProjectFormValues } from "@/lib/types";

export function emptyProjectForm(): ProjectFormValues {
  return {
    docTitle: "",
    industry: "",
    systemType: "",
    purpose: "",
    background: "",
    goals: "",
    inScope: "",
    outScope: "",
    assumptions: "",
    constraints: "",
    rolesText: "",
    minutesText: "",
  };
}

export function mapProjectToForm(project: {
  docTitle?: string;
  minutesText?: string;
  formFields?: Record<string, unknown>;
}): ProjectFormValues {
  const fields = project.formFields ?? {};
  return {
    docTitle: project.docTitle ?? "",
    industry: String(fields.industry ?? ""),
    systemType: String(fields.systemType ?? ""),
    purpose: String(fields.purpose ?? ""),
    background: String(fields.background ?? ""),
    goals: String(fields.goals ?? ""),
    inScope: String(fields.inScope ?? ""),
    outScope: String(fields.outScope ?? ""),
    assumptions: String(fields.assumptions ?? ""),
    constraints: String(fields.constraints ?? ""),
    rolesText: String(fields.rolesText ?? ""),
    minutesText: project.minutesText ?? "",
  };
}
