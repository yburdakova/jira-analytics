import ProjectPageClient from "./ProjectPageClient";

export default function ProjectPage({ params }: { params: { projectIdOrKey: string } }) {
  return <ProjectPageClient params={params} />;
}
