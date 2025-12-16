import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../graphql/queries";
import type { Project } from "../types";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import TaskBoard from "./TaskBoard";
import { useState } from "react";
import ProjectForm from "./ProjectForm";

interface ProjectDetailProps {
  organizationSlug: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ organizationSlug }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ project: Project }>(
    GET_PROJECT,
    {
      variables: { id: id!, organizationSlug },
      skip: !id,
    }
  );

  const project: Project | undefined = data?.project;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <p className="text-red-400">
              Error loading project: {error?.message || "Not found"}
            </p>
            <Button onClick={() => navigate("/")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto p-8">
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Dashboard
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {project.name}
                </h1>
                <span className={getStatusClass(project.status)}>
                  {getStatusLabel(project.status)}
                </span>
              </div>
              <p className="text-slate-400 max-w-2xl">
                {project.description || "No description"}
              </p>
            </div>

            <Button onClick={() => setShowEditForm(true)}>
              <Edit className="w-4 h-4 mr-2 inline" />
              Edit Project
            </Button>
          </div>

          <div className="flex gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              {project.dueDate ? (
                <span>
                  Due {format(new Date(project.dueDate), "MMMM dd, yyyy")}
                </span>
              ) : (
                <span>No due date</span>
              )}
            </div>

            <div className="text-slate-400">
              <span className="font-medium text-white">
                {project.completedTasks}
              </span>{" "}
              / {project.taskCount} tasks completed
            </div>

            <div className="text-slate-400">
              <span className="font-medium text-white">
                {project.taskCount > 0
                  ? Math.round(
                      (project.completedTasks / project.taskCount) * 100
                    )
                  : 0}
                %
              </span>{" "}
              progress
            </div>
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
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard projectId={id!} organizationSlug={organizationSlug} />

      {/* Edit Project Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectForm
              organizationSlug={organizationSlug}
              project={project}
              onClose={() => setShowEditForm(false)}
              onSuccess={() => {
                setShowEditForm(false);
                refetch();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
