"use client";

import { useProjects } from "@/context/ProjectsContext";
import Link from "next/link";
import Loader from "./Loader";

export default function Sidebar() {
  const { projects, setCurrentProject } = useProjects();

  if (!projects) {
    return <Loader note={"Loading the list of Projects..."}/>;
  }

  const handleProjectClick = (projectId: string) => {
    const selectedProject = projects.find((p) => p.key === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject);
    }
  };

  return (
    <aside className="w-64 p-4 border-r border-gray-200">
      <h2 className="text-lg font-bold mb-4">Projects</h2>
      <ul>
        {projects.map((project) => (
          <Link href={`/projects/${project.key}`} key={project.id}>
            <li
              className="cursor-pointer hover:bg-gray-200/50 p-2 rounded"
              onClick={() => handleProjectClick(project.key)}
            >
              {project.name} ({project.key})
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
}
