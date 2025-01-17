"use client";

import React, { createContext, useContext, useState } from "react";
import { ProjectContextType } from "@/types/JiraIssue";
import { fetchTotalForProject } from "@/util/getProjectTotal"; // Импортируем из утилиты
import { fetchTotalForPeriod } from "@/util/getProjectTotalByPeriod";

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [total, setTotal] = useState<number | null>(null);
  const [totalByPeriod, setTotalByPeriod] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectTotal = async (projectKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTotal = await fetchTotalForProject(projectKey);
      setTotal(fetchedTotal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectTotalbyPeriod = async (projectKey: string, startDate:string, endDate:string) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTotal = await fetchTotalForPeriod(projectKey, startDate, endDate);
      console.log(`ProjectContexst: fetchProjectTotalbyPeriod got data to fetchedTotal: ${fetchedTotal}`)
      setTotalByPeriod(fetchedTotal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        totalByPeriod,
        total,
        isLoading,
        error,
        fetchProjectTotal,
        fetchProjectTotalbyPeriod
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
