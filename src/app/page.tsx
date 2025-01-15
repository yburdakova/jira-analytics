"use client";

import { useProjects } from "@/context/ProjectsContext";
import { useState, useEffect } from "react";

const sections = ["General Info", "Tickets", "Counties", "Assignee", "Reporters"];

export default function ProjectPage() {
  const { projects, currentProject, setCurrentProject } = useProjects();
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projects && projects.length > 0) {
      if (!currentProject) {
        setCurrentProject(projects[0]); // Устанавливаем первый проект по умолчанию
      }
    }
  }, [projects, currentProject, setCurrentProject]);

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

      <div className="p-4">
        {activeSection === "General Info" && (
          <div>
            <h2 className="text-xl font-semibold">General Info</h2>
            <p>
              <strong>Key:</strong> {currentProject.key}
            </p>
            <p>
              <strong>Type:</strong> {currentProject.projectTypeKey}
            </p>
            <p>
              <strong>Private:</strong> {currentProject.isPrivate ? "Yes" : "No"}
            </p>
            <p>
              <strong>Style:</strong> {currentProject.style}
            </p>
          </div>
        )}
        {activeSection === "Tickets" && <div>Tickets content</div>}
        {activeSection === "Counties" && <div>Counties content</div>}
        {activeSection === "Assignee" && <div>Assignee content</div>}
        {activeSection === "Reporters" && <div>Reporters content</div>}
      </div>
    </div>
  );
}
