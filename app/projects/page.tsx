/** @format */
import PageTitle from "@/components/PageTitle";
import { CardContent } from "@/components/Card";
import Link from 'next/link';

interface Project {
    identifier: string;
    name: string;
}
  
const projectData: Project[] = [
    { identifier: "laer-trash", name: "Laer Trash"},
    { identifier: "emsdetten-trash", name: "Emsdetten Trash"},
    { identifier: "emsdetten-noise", name: "Emsdetten Noise"},
];

export default function Projects() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Your Projects" />
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-3">
        {projectData.map((project) => (
          <Link href={`/projects/${project.identifier.replace(/-/g, "/")}`} key={project.identifier}>
              <CardContent>
                <p>{project.name}</p>
              </CardContent>
          </Link>
        ))}
      </section>
    </div>
  );
}
