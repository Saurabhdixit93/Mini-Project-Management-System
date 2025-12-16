import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK, UPDATE_TASK } from "../graphql/mutations";
import type { Task } from "../types";
import { Button } from "./ui/Button";
import { Input, TextArea, Select } from "./ui/Input";
import { X } from "lucide-react";

interface TaskDetailProps {
  task?: Task;
  projectId?: string;
  initialStatus?: string;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  projectId,
  initialStatus,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || initialStatus || "TODO",
    assigneeEmail: task?.assigneeEmail || "",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK);
  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK);

  const loading = creating || updating;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (
      formData.assigneeEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.assigneeEmail)
    ) {
      newErrors.assigneeEmail = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const variables = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        assigneeEmail: formData.assigneeEmail,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
      };

      if (task) {
        await updateTask({
          variables: {
            id: task.id,
            ...variables,
          },
        });
      } else if (projectId) {
        await createTask({
          variables: {
            projectId,
            ...variables,
          },
        });
      }

      onUpdate();
    } catch (error: any) {
      console.error("Error saving task:", error);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-2">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-400 hover:text-white transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter task title"
              required
            />

            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "TODO", label: "To Do" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "DONE", label: "Done" },
              ]}
            />

            <Input
              label="Assignee Email"
              name="assigneeEmail"
              type="email"
              value={formData.assigneeEmail}
              onChange={handleChange}
              error={errors.assigneeEmail}
              placeholder="assignee@example.com"
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
                {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
