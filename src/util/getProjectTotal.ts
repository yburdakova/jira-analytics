export const fetchTotalForProject = async (projectKey: string): Promise<number> => {
  try {
    const response = await fetch(`/api/issues?project=${projectKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch total for project: ${projectKey}`);
    }

    const data = await response.json();
    console.log(`Total issues for project ${projectKey}:`, data.total);

    return data.total;
  } catch (error) {
    console.error(`Error fetching total for project ${projectKey}:`, error);
    throw error;
  }
};
