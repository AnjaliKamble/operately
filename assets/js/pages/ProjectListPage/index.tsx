import React from "react";

import { useDocumentTitle } from "@/layouts/header";
import { useProjects } from "@/graphql/Projects";
import FormattedTime from "@/components/FormattedTime";
import AvatarList from "@/components/AvatarList";

import Button from "@/components/Button";

import * as Icons from "@tabler/icons-react";
import * as Paper from "@/components/PaperContainer";
import { useCompany } from "@/graphql/Companies";

export function ProjectListPage() {
  useDocumentTitle("Projects");

  const { loading, error, data } = useProjects({});
  const companyData = useCompany();

  if (loading) return <></>;
  if (error) throw new Error(error.message);
  if (!companyData.data) return null;

  const projects = SortProjects(data.projects);

  return (
    <Paper.Root size="xlarge">
      <Paper.Body className="bg-dark-2" noPadding noGradient>
        <div className="flex items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Projects in {companyData.data.company.name}</h1>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button linkTo="/projects/new" variant="success">
              <Icons.IconClipboardList size={20} />
              New Project
            </Button>
          </div>
        </div>

        <ProjectList projects={projects} />
      </Paper.Body>
    </Paper.Root>
  );
}

function ProjectList({ projects }) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-white-1 border-b border-shade-2">
        <thead className="text-xs uppercase text-white-2 border-t border-shade-2">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-l-lg">
              Project Name
            </th>
            <th scope="col" className="px-6 py-3">
              Contributors
            </th>
            <th scope="col" className="px-6 py-3">
              Start Date
            </th>

            <th scope="col" className="px-6 py-3">
              Due Date
            </th>

            <th scope="col" className="px-6 py-3">
              Phase
            </th>

            <th scope="col" className="px-6 py-3 rounded-r-lg">
              Next Milestone
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <TableRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ project }) {
  const handleClick = () => {
    window.location.href = `/projects/${project.id}`;
  };

  return (
    <tr className="border-t border-shade-2 bg-dark-2 hover:bg-dark-3 cursor-pointer" onClick={handleClick}>
      <th scope="row" className="px-6 py-4 font-medium text-white-1 whitespace-nowrap rounded-l-lg">
        {project.name}
      </th>
      <td className="px-6 py-4">
        <AvatarList people={project.contributors.map((c) => c.person)} />
      </td>
      <td className="px-6 py-4 flex items-center gap-1">
        <DateOrNotSet date={project.startedAt} ifNull="No Start Date" />
      </td>
      <td className="px-6 py-4">
        <DateOrNotSet date={project.deadline} ifNull="No Due Date" />
      </td>
      <td className="px-6 py-4">
        <Phase phase={project.phase} />
      </td>
      <td className="px-6 py-4 rounded-r-lg overflow-hidden truncate max-w-0" style={{ minWidth: "200px" }}>
        <NextMilestone project={project} />
      </td>
    </tr>
  );
}

function NextMilestone({ project }) {
  if (project.nextMilestone === null) {
    return <span className="text-sm text-white-2">No milestones</span>;
  } else {
    return <>{project.nextMilestone.title}</>;
  }
}

function DateOrNotSet({ date, ifNull }) {
  if (date === null) {
    return <span className="text-sm text-white-2">{ifNull}</span>;
  }
  return (
    <div className="text-sm">
      <FormattedTime time={date} format="short-date" />
    </div>
  );
}

function Phase({ phase }) {
  return <span className="text-sm capitalize">{phase}</span>;
}

function SortProjects(projects) {
  return [].concat(projects).sort((a, b) => {
    let aStart = a.startedAt || 0;
    let bStart = b.startedAt || 0;

    if (aStart > bStart) return -1;
    if (aStart < bStart) return 1;
    return 0;
  });
}
