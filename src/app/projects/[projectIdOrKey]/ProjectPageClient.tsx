"use client";

import { useProjects } from "@/context/ProjectsContext";

export default function ProjectPageClient() {
  const { isLoading, currentProject } = useProjects();

  if (isLoading) {
    return <div>Loading data from context...</div>;
  }

  return (
    <div>
      <h1>Current project: {currentProject?.name}</h1>
    </div>
  );
}