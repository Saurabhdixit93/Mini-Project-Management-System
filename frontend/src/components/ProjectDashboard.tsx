import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS, GET_PROJECT_STATS } from "../graphql/queries";
import type { Project, ProjectStats } from "../types";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  GripVertical,
} from "lucide-react";
import { format } from "date-fns";
import ProjectForm from "./ProjectForm";
import { Link } from "react-router-dom";

interface ProjectDashboardProps {
  organizationSlug: string;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  organizationSlug,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const { data, loading, error, refetch } = useQuery<{ projects: Project[] }>(
    GET_PROJECTS,
    {
      variables: { organizationSlug },
    }
  );

  const { data: statsData } = useQuery<{ projectStats: ProjectStats }>(
    GET_PROJECT_STATS,
    {
      variables: { organizationSlug },
    }
  );

  const projects: Project[] = data?.projects || [];
  const stats: ProjectStats | undefined = statsData?.projectStats;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "status-active";
      case "COMPLETED":
        return "status-completed";
      case "ON_HOLD":
        return "status-on-hold";
      default:
        return "status-active";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ");
  };

  const handleProjectDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleProjectDragLeave = () => {
    setDragOver(false);
  };

  const handleProjectDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // For now, we'll just reset the drag state
    // In a more advanced implementation, you could reorder projects
    setDragOver(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <p className="text-red-400">
              Error loading projects: {error.message}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="heading-1 mb-2">Projects</h1>
            <p className="text-muted">Manage your organization's projects</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            <span className="hidden xs:inline">New Project</span>
            <span className="xs:hidden">New</span>
          </Button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="card-animated p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Total Projects</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats.totalProjects}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Circle className="w-5 h-5 text-primary-400" />
                </div>
              </div>
            </Card>

            <Card
              className="card-animated p-4"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Active</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats.activeProjects}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </Card>

            <Card
              className="card-animated p-4"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Total Tasks</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats.totalTasks}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Circle className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </Card>

            <Card
              className="card-animated p-4"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Completion Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats.completionRate.toFixed(0)}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Projects Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-200 ${
            dragOver ? "opacity-75" : ""
          }`}
          onDragOver={handleProjectDragOver}
          onDragLeave={handleProjectDragLeave}
          onDrop={handleProjectDrop}
        >
          {projects.map((project, index) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <div
                draggable
                onDragStart={(e: React.DragEvent) => {
                  e.dataTransfer.setData("text/plain", project.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <Card
                  className="card-animated hover:border-primary-500 transition-all duration-200 cursor-pointer h-full relative group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h3 className="text-xl font-semibold text-white">
                        {project.name}
                      </h3>
                    </div>
                    <span className={getStatusClass(project.status)}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-400">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span>
                        {project.completedTasks}/{project.taskCount} tasks
                      </span>
                    </div>

                    {project.dueDate && (
                      <div className="flex items-center text-slate-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {format(new Date(project.dueDate), "MMM dd")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full transition-all duration-300"
                      style={{
                        width: `${
                          project.taskCount > 0
                            ? (project.completedTasks / project.taskCount) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </Card>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-slate-400 mb-4">No projects yet</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create your first project
            </Button>
          </Card>
        )}

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProjectForm
                organizationSlug={organizationSlug}
                onClose={() => setShowCreateForm(false)}
                onSuccess={() => {
                  setShowCreateForm(false);
                  refetch();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
