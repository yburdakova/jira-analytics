import { JiraIssue } from "@/types/JiraIssue";

export const fetchAllIssuesForProject = async (
  projectKey: string
): Promise<JiraIssue[]> => {
  const allIssues: JiraIssue[] = [];
  const maxResults = 50;
  let startAt = 0;
  let hasMoreIssues = true;

  try {

    while (hasMoreIssues) {
      const url = `/api/issues?project=${projectKey}&startAt=${startAt}&maxResults=${maxResults}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.issues || !Array.isArray(data.issues)) {
        throw new Error("Invalid data format from API");
      }
      allIssues.push(...data.issues);

      if (data.issues.length < maxResults) {
        hasMoreIssues = false;
      } else {
        startAt += maxResults;
      }
    }
    return allIssues;

  } catch (error) {
    console.error(
      `Error during fetching issues for project ${projectKey} with startAt=${startAt}:`,
      error
    );
    throw error;
  }
};
