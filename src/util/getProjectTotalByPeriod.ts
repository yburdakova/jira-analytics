export const fetchTotalForPeriod = async (
  projectKey: string,
  startDate: string | null,
  endDate: string | null
): Promise<number> => {
  if (startDate && endDate) {
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
      throw error;
    }
  } else {
    try {
      const response = await fetch(`/api/issues?project=${projectKey}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch total for project: ${projectKey}`);
      }
      const data = await response.json();
      return data.total;
    } catch (error) {
      throw error;
    }
  }
};
