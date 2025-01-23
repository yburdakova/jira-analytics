"use client";

import React, { createContext, useContext, useState } from "react";
import { JiraIssue, ProjectContextType } from "@/types/JiraIssue";
import { fetchTotalForProject } from "@/util/getProjectTotal"; // Импортируем из утилиты
import { fetchTotalForPeriod } from "@/util/getProjectTotalByPeriod";
import { fetchDatedIssuesForProject } from "@/util/getDatedProjectIssues";
import { fetchAllIssuesForProject } from "@/util/getAllProjectIssues";

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [total, setTotal] = useState<number | null>(null);
  const [totalByPeriod, setTotalByPeriod] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [issues, setIssues] = useState<JiraIssue[] | null>(null);

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
        console.log("REQUEST DATA WITHOUT DATES!!!!!");
        const fetchedIssues = await fetchAllIssuesForProject(projectKey);
        console.log(`Fetched ${fetchedIssues.length} issues for full project.`);
        setIssues(fetchedIssues);
      } else {

        console.log("REQUEST DATA WITH DATES!!!!!");
        const fetchedDatedIssues = await fetchDatedIssuesForProject(projectKey, startDate, endDate);
        console.log(
          `Fetched ${fetchedDatedIssues.length} issues for project ${projectKey} within the specified period.`
        );
        setIssues(fetchedDatedIssues);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }


  const clearProjectData = () =>{
    console.log(`ProjectContexst: clear totalByPeriod`)
    setTotalByPeriod(null)
    setStartDate (null)
    setEndDate(null)
    setIssues(null)
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
        fetchProjectTotal,
        fetchProjectTotalbyPeriod,
        clearProjectData,
        fetchIssuesForAnalyze
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
