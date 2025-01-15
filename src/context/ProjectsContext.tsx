"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { z } from "zod";
import { JiraProjectSchema } from "@/types/JiraProject";

const ProjectsContext = createContext<{
  projects: z.infer<typeof JiraProjectSchema>[] | null;
  currentProject: z.infer<typeof JiraProjectSchema> | null;
  setCurrentProject: React.Dispatch<React.SetStateAction<z.infer<typeof JiraProjectSchema> | null>>;
  isLoading: boolean; // Добавлено состояние загрузки
} | null>(null);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<z.infer<typeof JiraProjectSchema>[] | null>(null);
  const [currentProject, setCurrentProject] = useState<z.infer<typeof JiraProjectSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Изначально загрузка

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        const validatedProjects = z.array(JiraProjectSchema).parse(data);

        setProjects(validatedProjects);
        if (validatedProjects.length > 0) {
          setCurrentProject(validatedProjects[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, currentProject, setCurrentProject, isLoading }}>
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
