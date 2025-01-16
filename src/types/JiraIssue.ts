import { z } from "zod";

export type JiraIssue = z.infer<typeof JiraIssueSchema>;

export interface ProjectContextType {
  issues: JiraIssue[] | null;
  total: number | null;
  isLoadingIssues: boolean;
  errorIssues: string | null;
  fetchIssuesForProject: (projectKey: string) => void;
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

//value  of JiraCustomField10501Schema is Custom field (Customer County)
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
  customfield_10501: JiraCustomField10501Schema.optional(),
  created: z.string().optional(),
  priority: JiraPrioritySchema.optional(),
  assignee: JiraUserSchema.optional(),
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
  expand: z.string(),
  startAt: z.number(),
  maxResults: z.number(),
  total: z.number(),
  issues: z.array(JiraIssueSchema),
});
