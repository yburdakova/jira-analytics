"use client";

import Loader from "@/components/Loader";
import { useProjects } from "@/context/ProjectsContext";
import { useEffect, useState } from "react";

export default function ProjectPageClient() {
  const { isLoading, currentProject } = useProjects();
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issuesLoading, setIssuesLoading] = useState(false);

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


  if (isLoading) {
    return <div>Loading data from context...</div>;
  }
  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h1>Current project: {currentProject?.name}</h1>
      {issuesLoading ?<Loader note={`Loading issues data of project ${currentProject?.name}...`}/>: <div className="">Total issues: {total}</div>}
    </div>
  );
}