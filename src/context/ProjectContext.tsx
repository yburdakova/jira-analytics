"use client";

import React, { createContext, useContext, useState } from "react";
import { JiraIssue, ProjectContextType, TableRow } from "@/types/JiraIssue";
import { fetchTotalForProject } from "@/util/getProjectTotal"; // Импортируем из утилиты
import { fetchTotalForPeriod } from "@/util/getProjectTotalByPeriod";
import { fetchDatedIssuesForProject } from "@/util/getDatedProjectIssues";
import { fetchAllIssuesForProject } from "@/util/getAllProjectIssues";
import { calculateIssuesStats } from "@/util/getIssuesStats";

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [total, setTotal] = useState<number | null>(null);
  const [totalByPeriod, setTotalByPeriod] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [issues, setIssues] = useState<JiraIssue[] | null>(null);
  const [analyzedStats, setAnalyzedStats] = useState<{ category: string; tableData: TableRow[]; months: string[] }[]>([]);


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

  const fetchProjectTotalbyPeriod = async (projectKey: string, startDate:string | null, endDate:string | null) => {
    setIsLoading(true);
    setError(null);
    setStartDate(startDate)
    setEndDate(endDate)
    try {
      const fetchedTotalbyPeriod = await fetchTotalForPeriod(projectKey, startDate, endDate);
      setTotalByPeriod(fetchedTotalbyPeriod);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIssuesForAnalyze = async (projectKey: string) =>{
    setIsLoading(true);
    setError(null);
    console.log(`startDate: ${startDate}, endDate: ${endDate}`)
    try {
      if (startDate === null || endDate === null) {
        const fetchedIssues = await fetchAllIssuesForProject(projectKey);
        setIssues(fetchedIssues);
      } else {
        const fetchedDatedIssues = await fetchDatedIssuesForProject(projectKey, startDate, endDate);
        setIssues(fetchedDatedIssues);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  const analyzeIssues = (category: "Tickets" | "Counties" | "Assignees" | "Reporters") => {
    const existingStat = analyzedStats.find((stat) => stat.category === category);
    if (existingStat) {
      console.log(`Stats for category "${category}" already exist.`);
      return;
    }

    if (issues) {
      const { stats: tableData, months } = calculateIssuesStats(issues, category);
      setAnalyzedStats((prevStats) => [
        ...prevStats,
        { category, tableData, months },
      ]);
      console.log(`Stats for category "${category}" calculated and saved.`);
    } else {
      console.warn("No issues available for analysis.");
    }
  };

  const clearProjectData = () =>{
    console.log(`ProjectContexst: clear totalByPeriod`)
    setTotalByPeriod(null)
    setStartDate (null)
    setEndDate(null)
    setIssues(null)
    setAnalyzedStats([])
  }


  return (
    <ProjectContext.Provider
    value={{
      totalByPeriod,
      total,
      isLoading,
      error,
      startDate,
      endDate,
      issues,
      analyzedStats,
      fetchProjectTotal,
      fetchProjectTotalbyPeriod,
      fetchIssuesForAnalyze,
      analyzeIssues,
      clearProjectData,
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
