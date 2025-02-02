import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const baseUrl = "https://courthousecomputersystems.atlassian.net/rest/api/3";
  const email = process.env.NEXT_PUBLIC_JIRA_API_EMAIL;
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;

  if (!email || !token) {
    console.error("JIRA_API_EMAIL or JIRA_API_TOKEN is not defined");
    return NextResponse.json({ error: "Email or token not defined" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const projectKey = searchParams.get("project");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const startAt = searchParams.get("startAt") || "0";
  const maxResults = searchParams.get("maxResults") || "50";

  if (!projectKey) {
    return NextResponse.json({ error: "Project key is required" }, { status: 400 });
  }

  try {
    let jql = `project=${projectKey}`;
    if (startDate && endDate) {
      jql += ` AND created >= "${startDate}" AND created <= "${endDate}"`;
    }

    const url = `${baseUrl}/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}`;
    console.log(`Requesting Jira API: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira API error:", errorText);
      throw new Error(`Error fetching issues: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      total: data.total,
      issues: data.issues,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in API route (issues):", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
