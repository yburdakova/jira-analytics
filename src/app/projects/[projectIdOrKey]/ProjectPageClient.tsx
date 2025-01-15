"use client";

import { useProjects } from "@/context/ProjectsContext";
import { useEffect, useState } from "react";

const sections = ["General Info", "Tickets", "Counties", "Assignee", "Reporters"];

export default function ProjectPageClient({ params }: { params: { projectIdOrKey: string } }) {
  const { projects, currentProject, setCurrentProject } = useProjects();
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Projects:", projects);
    console.log("Params:", params);

    if (projects && params.projectIdOrKey) {
      const project = projects.find((p) => p.key === params.projectIdOrKey);
      if (project) {
        setCurrentProject(project);
      } else {
        setError(`Project with key "${params.projectIdOrKey}" not found.`);
      }
    }
  }, [projects, params, setCurrentProject]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentProject) {
    return <div>Loading project details...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{currentProject.name}</h1>
      <div className="mb-4 flex gap-4">
        {sections.map((section) => (
          <button
            key={section}
            className={`px-4 py-2 rounded ${
              activeSection === section
                ? "bg-blue-500 text-white"
                : "bg-gray-200/50 hover:bg-blue-300/50"
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>
    </div>
  );
}
