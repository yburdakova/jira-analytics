"use client";

import Loader from "@/components/Loader";
// import Loader from "@/components/Loader";
import ProjectSettings from "@/components/ProjectSettings";
import { useProject } from "@/context/ProjectContext";
import { useProjects } from "@/context/ProjectsContext";
import { useEffect, useState } from "react";

export default function ProjectPageClient() {
  const sections = ["Settings", "Tickets", "Counties", "Assignees", "Reporters"];

  const { currentProject } = useProjects();
  const { total, error, isLoading, totalByPeriod, fetchProjectTotal, fetchProjectTotalbyPeriod } =useProject();
  const [activeSection, setActiveSection] = useState<string>("Settings");
  const [isBtnAnalyzeActive, setIsAnalyzingActive] = useState<boolean>(false);

useEffect(() => {
    setIsAnalyzingActive(false);
    if (currentProject) {
      fetchProjectTotal(currentProject.key);
    }
},[currentProject])

useEffect(() => {
  console.log("Total by period updated:", totalByPeriod);
}, [totalByPeriod]);

const handlePeriodSubmit = async (startDate: string | null, endDate: string | null) => {
  if (currentProject) {
    if (startDate && endDate) {
      await fetchProjectTotalbyPeriod(currentProject.key, startDate, endDate);
      setIsAnalyzingActive(true);
    } else {
      await fetchProjectTotal(currentProject.key);
    }
  }
};


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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Current project: {currentProject?.name}
      </h1>
      {isLoading && <Loader note={`Loading total tickets data...`} />}
        <div className="font-semibold text-xl">
          Total tickets: {total}
        </div>
        <div className="flex align-middle gap-8">
          <div className="content-center font-medium text-xl"> Tickets for analyze : {totalByPeriod ? totalByPeriod : "0"}</div>
          <button disabled={!isBtnAnalyzeActive} className="px-4 disabled:cursor-not-allowed py-2 rounded bg-blue-700 text-white hover:bg-foreground hover:text-background">Analyze</button>
        </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
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
      </div>
      <div className="py-4">
      {activeSection === "Settings" && (
          <ProjectSettings onSubmit={handlePeriodSubmit} />
        )}
        {activeSection === "Tickets" && <div>Tickets content</div>}
        {activeSection === "Counties" && <div>Counties content</div>}
        {activeSection === "Assignees" && <div>Assignees content</div>}
        {activeSection === "Reporters" && <div>Reporters content</div>}
      </div>
      <div className="data-container"></div>
    </div>
  );
}
