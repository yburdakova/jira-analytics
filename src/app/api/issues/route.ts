import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://courthousecomputersystems.atlassian.net/rest/api/3";
  const projectKey = "CRPINDEX";
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;

  if (!token) {
    console.error("JIRA_API_TOKEN is not defined");
    return NextResponse.json({ error: "JIRA_API_TOKEN is not defined" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/search?jql=project=${projectKey}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`email@example.com:${token}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    console.log("Jira response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira API error:", errorText);
      throw new Error(`Error fetching data from Jira: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Jira data:", data);
    return NextResponse.json({ total: data.total }); // Возвращаем количество задач
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in API route:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
