"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { JiraProjectArraySchema } from "@/types/JiraProject"; // Импорт схемы Zod

export default function Home() {

  const [projects, setProjects] = useState<z.infer<typeof JiraProjectArraySchema> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        const validatedData = JiraProjectArraySchema.parse(data);
        setProjects(validatedData);
      } catch (err) {
        if (err instanceof z.ZodError) {
          console.error("Validation error:", err.errors);
          setError("Invalid data format received from API.");
        } else {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (projects === null) {
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <h1>Jira Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} ({project.key})
          </li>
        ))}
      </ul>
    </div>
  );
}
