import { JiraIssue, TableRow } from "@/types/JiraIssue";

export const calculateIssuesStats = (
  issues: JiraIssue[],
  category: "Tickets" | "Counties" | "Assignees" | "Reporters"
): { stats: TableRow[]; months: string[] } => {
  const stats: TableRow[] = [];
  const allMonthsSet = new Set<string>();

  issues.forEach((issue) => {
    let categoryValue: string;
    switch (category) {
      case "Tickets":
        categoryValue = issue.fields.status?.name || "Ticket is not specified";
        break;
      case "Counties":
        categoryValue = issue.fields.customfield_10501?.value || "County is not specified";
        break;
      case "Assignees":
        categoryValue = issue.fields.assignee?.displayName || "Assignee is not specified";
        break;
      case "Reporters":
        categoryValue = issue.fields.reporter?.displayName || "Reporter is not specified";
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }

    const createdDate = issue.fields.created;
    if (!createdDate) return;

    const date = new Date(createdDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${month}-${year}`;

    allMonthsSet.add(formattedDate);

    const existingRow = stats.find((row) => row.name === categoryValue);

    if (existingRow) {
      existingRow.total += 1;
      existingRow.monthlyData[formattedDate] =
        (existingRow.monthlyData[formattedDate] || 0) + 1;
    } else {
      stats.push({
        name: categoryValue,
        total: 1,
        averagePerMonth: 0,
        monthlyData: { [formattedDate]: 1 },
      });
    }
  });

  const allMonths = Array.from(allMonthsSet).sort((a, b) => {
    const [monthA, yearA] = a.split("-").map(Number);
    const [monthB, yearB] = b.split("-").map(Number);
  
    if (yearA === yearB) {
      return monthB - monthA;
    }
    return yearB - yearA;
  });

  stats.forEach((row) => {
    const totalMonths = allMonths.length;
    row.averagePerMonth = row.total / totalMonths;
  });

  return { stats, months: allMonths };
};
