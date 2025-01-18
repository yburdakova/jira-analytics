import { z } from "zod";

export type JiraIssue = z.infer<typeof JiraIssueSchema>;

export interface ProjectData {
  total: number | null;
  issues: JiraIssue[] | null;
}

export type ProjectsData = Record<string, ProjectData>;

export interface ProjectContextType {
  total: number | null;
  totalByPeriod: number | null;
  isLoading: boolean;
  error: string | null;
  startDate: string | null;
  endDate: string | null;
  fetchProjectTotal: (projectKey: string) => void;
  clearProjectData: () => void;
  fetchProjectTotalbyPeriod:(projectKey: string, startDate:string | null, endDate:string | null) => void;
}

export interface AnalyticsRow {
  name: string;
  monthlyData: Record<string, number>;
  total: number;
  averagePerMonth: number;
}

export const JiraStatusSchema = z.object({
  self: z.string(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  name: z.string(),
  id: z.string().optional(),
  statusCategory: z
    .object({
      self: z.string(),
      id: z.number(),
      key: z.string(),
      colorName: z.string(),
      name: z.string(),
    })
    .optional(),
});

export const JiraUserSchema = z.object({
  self: z.string(),
  accountId: z.string().optional(),
  emailAddress: z.string().optional(),
  displayName: z.string(),
  active: z.boolean().optional(),
  timeZone: z.string().optional(),
  accountType: z.string().optional(),
  avatarUrls: z
    .object({
      "48x48": z.string().optional(),
      "24x24": z.string().optional(),
      "16x16": z.string().optional(),
      "32x32": z.string().optional(),
    })
    .optional(),
});

export const JiraProjectInfoSchema = z.object({
  self: z.string(),
  id: z.string(),
  key: z.string(),
  name: z.string(),
  projectTypeKey: z.string().optional(),
  simplified: z.boolean().optional(),
  avatarUrls: z
    .object({
      "48x48": z.string().optional(),
      "24x24": z.string().optional(),
      "16x16": z.string().optional(),
      "32x32": z.string().optional(),
    })
    .optional(),
});

export const JiraCustomField10501Schema = z.object({
  self: z.string(),
  value: z.string(),
  id: z.string(),
});

export const JiraPrioritySchema = z.object({
  self: z.string(),
  iconUrl: z.string().optional(),
  name: z.string(),
  id: z.string().optional(),
});

export const JiraIssueFieldsSchema = z.object({
  customfield_10501: JiraCustomField10501Schema.nullable(),
  created: z.string().optional(),
  priority: JiraPrioritySchema.optional(),
  assignee: JiraUserSchema.nullable(),
  status: JiraStatusSchema.optional(),
  reporter: JiraUserSchema.optional(),
  project: JiraProjectInfoSchema.optional(),
  summary: z.string().optional(),
});

export const JiraIssueSchema = z.object({
  expand: z.string(),
  id: z.string(),
  self: z.string(),
  key: z.string(),
  fields: JiraIssueFieldsSchema,
});

export const JiraSearchResponseSchema = z.object({
  expand: z.string().optional(),
  startAt: z.number().optional(),
  maxResults: z.number().optional(),
  total: z.number(),
  issues: z.array(JiraIssueSchema),
});
