import { z } from "zod";
import { JiraProjectSchema } from "@/types/JiraProject";

export const fetchProjects = async () => {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const data = await response.json();
    const validatedProjects = z.array(JiraProjectSchema).parse(data);

    return validatedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
