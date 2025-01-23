import { JiraIssue } from "@/types/JiraIssue";

export const fetchDatedIssuesForProject = async (
  projectKey: string,
  startDate: string | null,
  endDate: string | null
): Promise<JiraIssue[]> => {
  const allIssues: JiraIssue[] = [];
  const maxResults = 50;
  let startAt = 0;
  let hasMoreIssues = true;

  try {
    console.log(`Starting fetch for project ${projectKey} within date range: ${startDate} to ${endDate}`);
    console.log(`Max results per request: ${maxResults}`);

    while (hasMoreIssues) {
      const url = `/api/issues?project=${projectKey}&startDate=${startDate}&endDate=${endDate}&startAt=${startAt}&maxResults=${maxResults}`;
      console.log(`Requesting issues from URL: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.issues || !Array.isArray(data.issues)) {
        throw new Error("Invalid data format from API");
      }

      allIssues.push(...data.issues);
      console.log(`Fetched ${data.issues.length} issues. Total fetched so far: ${allIssues.length}`);

      if (data.issues.length < maxResults) {
        hasMoreIssues = false;
      } else {
        startAt += maxResults;
      }
    }

    console.log(`All issues fetched for project ${projectKey}. Total fetched: ${allIssues.length}`);
    return allIssues;
  } catch (error) {
    console.error(
      `Error fetching project issues for project ${projectKey} within date range ${startDate} to ${endDate}:`,
      error
    );
    throw error;
  }
};
