import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { projectIdOrKey: string } }
) {
  const { projectIdOrKey } = params;

  if (!projectIdOrKey) {
    return NextResponse.json({ error: "Project ID or Key is required" }, { status: 400 });
  }

  const baseUrl = "https://courthousecomputersystems.atlassian.net/rest/api/3/project";
  const email = process.env.NEXT_PUBLIC_JIRA_API_EMAIL;
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;

  if (!email || !token) {
    return NextResponse.json(
      { error: "JIRA_API_EMAIL or JIRA_API_TOKEN is not defined" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/${projectIdOrKey}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira API error:", errorText);
      throw new Error(`Error fetching project: ${response.statusText}`);
    }

    const projectData = await response.json();
    return NextResponse.json(projectData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in API route:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
