import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { projectIdOrKey: string } }) {
  const baseUrl = "https://courthousecomputersystems.atlassian.net/rest/api/3";
  const email = process.env.NEXT_PUBLIC_JIRA_API_EMAIL;
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;

  if (!email || !token) {
    console.error("JIRA_API_EMAIL or JIRA_API_TOKEN is not defined");
    return NextResponse.json({ error: "Email or token not defined" }, { status: 500 });
  }

  const { projectIdOrKey } = params;

  try {
    const response = await fetch(`${baseUrl}/project/${projectIdOrKey}`, {
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
