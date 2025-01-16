"use client";

import { JiraIssue, ProjectContextType } from "@/types/JiraIssue";
import React, { createContext, useContext, useState } from "react";


const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<JiraIssue[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [isLoadingIssues, setIsLoadingIssues] = useState<boolean>(false);
  const [errorIssues, setErrorIssues] = useState<string | null>(null);

  const fetchIssuesForProject = async (projectKey: string) => {
    try {
      setIsLoadingIssues(true);
      setErrorIssues(null);
      setIssues(null);
      setTotal(null);

      const response = await fetch(`/api/issues?key=${projectKey}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }
      const data = await response.json();
      setTotal(data.total ?? 0);
      setIssues(data.issues ?? []);
    } catch (error) {
      setErrorIssues(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoadingIssues(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        issues,
        total,
        isLoadingIssues,
        errorIssues,
        fetchIssuesForProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
