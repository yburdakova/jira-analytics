"use client";

import Loader from "@/components/Loader";
import { useProjects } from "@/context/ProjectsContext";
import { useEffect, useState } from "react";

export default function ProjectPageClient() {
  const { currentProject } = useProjects();
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const sections = ["Tickets", "Counties", "Assignees", "Reporters"]

  useEffect(() => {
    fetchIssues();
  }, [currentProject]);

  const fetchIssues = async () => {
    try {
      setIssuesLoading(true);
      setError(null);
      if (currentProject) {
        const response = await fetch(`/api/issues?key=${currentProject.key}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const data = await response.json();
        setTotal(data.total ?? 0);
      } else {
        console.log(`Failed to fetch issues becasue currentProject is not found` )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIssuesLoading(false);
      console.log( `Data was loaded successfully`)
    }
  };

  const getAnalytics = (section: string) => {
    if (section) {
      setActiveSection(section);
    }
    console.log(`Fetching ${section} analytics...`);
  };

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Current project: {currentProject?.name}</h1>
      {issuesLoading ?<Loader note={`Loading tickets data...`}/>: <div className="">Total tickets: {total}</div>}
      <div className="mb-4 flex gap-4">
        {sections.map((section) => (
          <button
            key={section}
            className={`px-4 py-2 rounded ${
              activeSection === section
                ? "bg-blue-500 text-white"
                : "bg-gray-200/50 hover:bg-blue-300/50"
            }`}
            onClick={() => getAnalytics(section)}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeSection === "Tickets" && <div>Tickets content</div>}
        {activeSection === "Counties" && <div>Counties content</div>}
        {activeSection === "Assignee" && <div>Assignee content</div>}
        {activeSection === "Reporters" && <div>Reporters content</div>}
      </div>
    </div>
  );
}