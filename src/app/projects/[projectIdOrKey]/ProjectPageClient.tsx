"use client";

import Loader from "@/components/Loader";
import ProjectSettings from "@/components/ProjectSettings";
import ScrollableTable from "@/components/ScrollableTable";
import { useProject } from "@/context/ProjectContext";
import { useProjects } from "@/context/ProjectsContext";
import { useEffect, useState } from "react";

export default function ProjectPageClient() {
  const sections = ["Settings", "Tickets", "Counties", "Assignees", "Reporters"];

  const { currentProject } = useProjects();
  const {
    total,
    error,
    isLoading,
    totalByPeriod,
    analyzedStats,
    fetchProjectTotal,
    fetchProjectTotalbyPeriod,
    fetchIssuesForAnalyze,
    analyzeIssues
  } =useProject();
  const [activeSection, setActiveSection] = useState<string>("Settings");
  const [isBtnAnalyzeActive, setIsAnalyzingActive] = useState<boolean>(false);

  const activeStats = analyzedStats.find((stat) => stat.category === activeSection);

useEffect(() => {
    setIsAnalyzingActive(false);
    if (currentProject) {
      fetchProjectTotal(currentProject.key);
    }
},[currentProject])

const handlePeriodSubmit = async (startDate: string | null, endDate: string | null) => {
  if (currentProject) {
    fetchProjectTotalbyPeriod(currentProject.key, startDate, endDate);
    setIsAnalyzingActive(true);
  }
};

  const getAnalytics = () => {
    if (currentProject) {
      fetchIssuesForAnalyze(currentProject.key)
    }
  };

  const displayAnalyticsResult = (section: string) => {
    if (section) {
      setActiveSection(section)
      if (section !== "Settings") {
        analyzeIssues(section as "Tickets" | "Counties" | "Assignees" | "Reporters");
      }

    }
    console.log(analyzedStats)
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
          <button
            disabled={!isBtnAnalyzeActive}
            className="px-4 disabled:cursor-not-allowed py-2 rounded bg-blue-700 text-white hover:bg-foreground hover:text-background"
            onClick={() => getAnalytics()}
          >
            Analyze
          </button>
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
              onClick={() => displayAnalyticsResult(section)}
            >
              {section}
            </button>
          ))}
          </div>
      </div>
      <div className="data-container">

        {activeSection === "Settings" && <ProjectSettings onSubmit={handlePeriodSubmit} />}
        {activeSection !== "Settings" && activeStats && (
            <ScrollableTable data={activeStats.tableData} months={activeStats.months} />
        )}

      </div>
    </div>
  );
}