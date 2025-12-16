import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASKS } from "../graphql/queries";
import { UPDATE_TASK } from "../graphql/mutations";
import type { Task } from "../types";
import { Card } from "./ui/Card";
import { Plus, User, Calendar, GripVertical } from "lucide-react";
import { format } from "date-fns";
import TaskDetail from "./TaskDetail";

interface TaskBoardProps {
  projectId: string;
  organizationSlug: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  projectId,
  organizationSlug,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const { data, loading, error, refetch } = useQuery<{ tasks: Task[] }>(
    GET_TASKS,
    {
      variables: { projectId, organizationSlug },
    }
  );

  const [updateTask] = useMutation(UPDATE_TASK);

  const tasks: Task[] = data?.tasks || [];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        await updateTask({
          variables: {
            id: draggedTask.id,
            status: newStatus,
          },
          optimisticResponse: {
            updateTask: {
              __typename: "UpdateTask",
              success: true,
              errors: [],
              task: {
                __typename: "TaskType",
                id: draggedTask.id,
                status: newStatus,
              },
            },
          },
        });
        refetch();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
    setDraggedTask(null);
  };

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  const columns = [
    { id: "TODO", title: "To Do", tasks: tasksByStatus.TODO, color: "slate" },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      tasks: tasksByStatus.IN_PROGRESS,
      color: "purple",
    },
    { id: "DONE", title: "Done", tasks: tasksByStatus.DONE, color: "green" },
  ];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTask({
        variables: {
          id: taskId,
          status: newStatus,
        },
        optimisticResponse: {
          updateTask: {
            __typename: "UpdateTask",
            success: true,
            errors: [],
            task: {
              __typename: "TaskType",
              id: taskId,
              status: newStatus,
            },
          },
        },
      });
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-700 rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <p className="text-red-400">Error loading tasks: {error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {column.title}
                </h3>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs">
                  {column.tasks.length}
                </span>
              </div>
              <button
                onClick={() => setShowCreateTask(column.id)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div
              className="space-y-3 flex-1 min-h-[100px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:border-primary-500 transition-all"
                  onClick={() => handleTaskClick(task)}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium mb-2">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        {task.assigneeEmail && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">
                              {task.assigneeEmail}
                            </span>
                          </div>
                        )}

                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {format(new Date(task.dueDate), "MMM dd")}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-1 ml-auto">
                          {column.id !== "TODO" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(task.id, "TODO");
                              }}
                              className="p-1 hover:bg-slate-700 rounded text-xs"
                              title="Move to To Do"
                            >
                              ←
                            </button>
                          )}
                          {column.id !== "DONE" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(task.id, "DONE");
                              }}
                              className="p-1 hover:bg-slate-700 rounded text-xs"
                              title="Move to Done"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {column.tasks.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-700 rounded-lg">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            setSelectedTask(null);
            refetch();
          }}
        />
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <TaskDetail
          projectId={projectId}
          initialStatus={showCreateTask}
          onClose={() => setShowCreateTask(null)}
          onUpdate={() => {
            setShowCreateTask(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;
