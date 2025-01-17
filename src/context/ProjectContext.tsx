"use client";

import React, { createContext, useContext, useState } from "react";
import { ProjectContextType, ProjectsData } from "@/types/JiraIssue";
import { fetchTotalForProject } from "@/utils/getProjectTotal"; // Импортируем из утилиты

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectsData, setProjectsData] = useState<ProjectsData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectData = async (projectKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (projectsData[projectKey]) {
        console.log(`Data for project ${projectKey} already exists:`, projectsData[projectKey]);
        return;
      }

      const total = await fetchTotalForProject(projectKey);

      setProjectsData((prev) => ({
        ...prev,
        [projectKey]: {
          total,
          issues: null,
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projectsData,
        isLoading,
        error,
        fetchProjectData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
