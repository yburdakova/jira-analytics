import { JiraProjectSchema } from "@/types/JiraProject";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const baseUrl = "https://courthousecomputersystems.atlassian.net/rest/api/2";
  const email = process.env.NEXT_PUBLIC_JIRA_API_EMAIL;
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;

  if (!email || !token) {
    console.error("JIRA_API_EMAIL or JIRA_API_TOKEN is not defined");
    return NextResponse.json({ error: "Email or token not defined" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/project`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira API error:", errorText);
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }

    const data: z.infer<typeof JiraProjectSchema>[] = await response.json();

    const filteredProjects = data.filter((project: z.infer<typeof JiraProjectSchema>) =>
      project.name?.startsWith("CRP") || project.key?.startsWith("CRP")
    );

    return NextResponse.json(filteredProjects);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in API route:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
