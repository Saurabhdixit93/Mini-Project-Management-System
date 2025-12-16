import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT, UPDATE_PROJECT } from "../graphql/mutations";
import type { Project } from "../types";
import { Button } from "./ui/Button";
import { Input, TextArea, Select } from "./ui/Input";
import { X } from "lucide-react";

interface ProjectFormProps {
  organizationSlug: string;
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  organizationSlug,
  project,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "ACTIVE",
    dueDate: project?.dueDate ? project.dueDate.split("T")[0] : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT);
  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT);

  const loading = creating || updating;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (project) {
        await updateProject({
          variables: {
            id: project.id,
            organizationSlug,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            dueDate: formData.dueDate || null,
          },
        });
      } else {
        await createProject({
          variables: {
            organizationSlug,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            dueDate: formData.dueDate || null,
          },
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving project:", error);
      setErrors({ submit: error.message });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-2">
          {project ? "Edit Project" : "New Project"}
        </h2>
        <button
          onClick={onClose}
          className="cursor-pointer text-slate-400 hover:text-white transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter project name"
          required
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter project description"
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "ON_HOLD", label: "On Hold" },
            { value: "COMPLETED", label: "Completed" },
          ]}
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : project
              ? "Update Project"
              : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
