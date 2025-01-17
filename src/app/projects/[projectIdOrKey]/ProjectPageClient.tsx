"use client";

import Loader from "@/components/Loader";
import { useProject } from "@/context/ProjectContext";
import { useProjects } from "@/context/ProjectsContext";
import { useEffect, useState } from "react";

export default function ProjectPageClient() {
  const { currentProject } = useProjects();
  const [activeSection, setActiveSection] = useState<string>("");

  const { projectsData, isLoading, error, fetchProjectData } = useProject();

  const sections = ["Total", "Tickets", "Counties", "Assignees", "Reporters"];

  useEffect(() => {
    if (!currentProject) return;
    fetchProjectData(currentProject.key);
  }, [currentProject]);

  const currentProjectData = currentProject
    ? projectsData[currentProject.key]
    : null;

  const getAnalytics = (section: string) => {
    if (section) {
      setActiveSection(section);
    }
    console.log(`Fetching ${section} analytics...`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">
        Current project: {currentProject?.name}
      </h1>
      {isLoading ? (
        <div>
          <Loader note={`Loading tickets data...`} />
          Total tickets: unknown
        </div>
      ) : currentProjectData ? (
        <div className="">
          Total tickets: {currentProjectData.total ?? "Unknown"}
        </div>
      ) : (
        <div>No data available for the current project.</div>
      )}
      <div className="mb-4 flex gap-4">
        {sections.map((section) => (
          <button
            key={section}
            className={`px-4 py-2 rounded ${
              activeSection === section
                ? "bg-blue-500 text-white"
                : "bg-gray-200/50 hover:bg-blue-300/50"
            }`}
            onClick={() => getAnalytics(section)}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="py-4">
        {activeSection === "Total" && <div>Total info content</div>}
        {activeSection === "Tickets" && <div>Tickets content</div>}
        {activeSection === "Counties" && <div>Counties content</div>}
        {activeSection === "Assignees" && <div>Assignees content</div>}
        {activeSection === "Reporters" && <div>Reporters content</div>}
      </div>
      <div className="data-container"></div>
    </div>
  );
}
