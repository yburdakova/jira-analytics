import { JiraIssue, JiraSearchResponseSchema } from "@/types/JiraIssue";

export const fetchAllIssuesForProject = async (projectKey: string): Promise<JiraIssue[]> => {
  const allIssues: JiraIssue[] = [];
  const maxResults = 50;
  let startAt = 0;
  let total = 0;

  try {
    do {
      console.log(`Fetching issues for project ${projectKey} with startAt=${startAt}`);
      const response = await fetch(
        `/api/issues?project=${projectKey}&startAt=${startAt}&maxResults=${maxResults}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      const validatedData = JiraSearchResponseSchema.parse(data);

      if (startAt === 0) {
        total = validatedData.total;
        console.log(`Total issues in project ${projectKey}: ${total}`);
      }

      allIssues.push(...validatedData.issues);
      console.log(
        `Fetched ${validatedData.issues.length} issues starting from index ${startAt}. Total fetched: ${allIssues.length}`
      );

      startAt += maxResults;
    } while (allIssues.length < total);

    console.log(`All issues fetched for project ${projectKey}. Total fetched: ${allIssues.length}`);
  } catch (error) {
    console.error("Error fetching project issues:", error);
    throw error;
  }

  return allIssues;
};
