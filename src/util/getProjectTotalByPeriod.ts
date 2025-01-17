export const fetchTotalForPeriod = async (
  projectKey: string,
  startDate: string,
  endDate: string
): Promise<number> => {
  console.log(`Fetching issues for ${projectKey} with dates: ${startDate} to ${endDate}`);
  console.log(`URL: /api/issues?project=${projectKey} AND created >= "${startDate}" AND created <= "${endDate}"`);

  try {
    const jql = `project=${projectKey} AND created >= "${startDate}" AND created <= "${endDate}"`;
    const response = await fetch(`/api/issues?${jql}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch total for project: ${projectKey} within the period`);
    }

    const data = await response.json();
    console.log(`Total issues for project ${projectKey} within ${startDate} to ${endDate}:`, data.total);

    return data.total;
  } catch (error) {
    console.error(`Error fetching total for project ${projectKey} within the period:`, error);
    throw error;
  }
};
