"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { z } from "zod";
import { JiraProjectSchema } from "@/types/JiraProject";
import { fetchProjects } from "@/util/getProjects";

const ProjectsContext = createContext<{
  projects: z.infer<typeof JiraProjectSchema>[] | null;
  currentProject: z.infer<typeof JiraProjectSchema> | null;
  setCurrentProject: React.Dispatch<React.SetStateAction<z.infer<typeof JiraProjectSchema> | null>>;
  isLoading: boolean;
} | null>(null);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<z.infer<typeof JiraProjectSchema>[] | null>(null);
  const [currentProject, setCurrentProject] = useState<z.infer<typeof JiraProjectSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const validatedProjects = await fetchProjects();
        setProjects(validatedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (currentProject) {
      console.log("CurrentProject changed:", currentProject.key);
    }
  }, [currentProject]);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        isLoading,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
