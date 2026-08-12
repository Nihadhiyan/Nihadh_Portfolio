import { getPublishedProjects } from "@/lib/outstatic";
import { ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";

export async function ProjectGrid() {
  const projects = getPublishedProjects();

  if (!projects || projects.length === 0) {
    return <p className="text-muted-foreground text-sm">No projects found. Add one in the CMS!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <article
          key={project.slug}
          className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 flex flex-col group"
        >
          {project.coverImage && (
            <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-black/10 dark:border-white/10">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">
              {project.title}
            </h3>

            <p className="text-muted line-clamp-3 text-sm mb-4">
              {project.description || "No description provided."}
            </p>

            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-black/5 dark:bg-white/10 text-foreground rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-sm font-medium flex items-center gap-1.5 hover:text-accent-primary transition-colors">
                  <ExternalLink className="w-4 h-4" /> Live Site
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium flex items-center gap-1.5 hover:text-accent-primary transition-colors">
                  <SiGithub className="w-4 h-4" /> Source
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
