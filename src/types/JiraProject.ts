import { z } from "zod";

export const JiraProjectSchema = z.object({
  expand: z.string(),
  self: z.string(),
  id: z.string(),
  key: z.string(),
  name: z.string(),
  avatarUrls: z.object({
    "48x48": z.string(),
    "24x24": z.string(),
    "16x16": z.string(),
    "32x32": z.string(),
  }),
  projectCategory: z
    .object({
      self: z.string(),
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })
    .optional(),
  projectTypeKey: z.string(),
  simplified: z.boolean(),
  style: z.string(),
  isPrivate: z.boolean(),
  properties: z.record(z.unknown()),
});

export const JiraProjectArraySchema = z.array(JiraProjectSchema);
