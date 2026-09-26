import { useState, useEffect } from "react";
import {
  CheckSquare,
  Square,
  PlusCircle,
  Calendar,
  AlertCircle,
  Clock,
  Trash2,
  Tag,
  CheckCircle2,
  Flame
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const { showToast } = useToast();

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      showToast("Error loading tasks.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const res = await api.patch(`/tasks/${task._id}`, { status: nextStatus });
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
        );
        showToast(
          nextStatus === "completed" ? "Task marked completed! 🎉" : "Task marked pending.",
          "success"
        );
      }
    } catch (err) {
      showToast("Failed to update task state.", "error");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Task title is required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate || null
      });

      if (res.data.success) {
        showToast("Task scheduled successfully.", "success");
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setDueDate("");
        fetchTasks();
      }
    } catch (err) {
      showToast("Failed to create task.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      const res = await api.delete(`/tasks/${deleteTaskId}`);
      if (res.data.success) {
        showToast("Task deleted.", "success");
        setTasks((prev) => prev.filter((t) => t._id !== deleteTaskId));
      }
    } catch (err) {
      showToast("Error deleting task.", "error");
    } finally {
      setDeleteTaskId(null);
    }
  };

  // Filtered views
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "pending") return t.status !== "completed";
    if (filterStatus === "completed") return t.status === "completed";
    if (filterStatus === "high") return t.priority === "high" && t.status !== "completed";
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status !== "completed").length;
  const highPriorityCount = tasks.filter((t) => t.priority === "high" && t.status !== "completed").length;

  return (
    <div className="space-y-6">
      {/* Title & Add */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Tasks & Reminders</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
              {pendingCount} Pending
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize personal commitments, tax deadlines, and medical follow-ups.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
        >
          <PlusCircle className="h-4 w-4 text-emerald-400" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xs">
        {[
          { id: "All", label: `All Tasks (${tasks.length})` },
          { id: "pending", label: `Pending (${pendingCount})` },
          { id: "high", label: `Urgent / High Priority (${highPriorityCount})` },
          { id: "completed", label: `Completed` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              filterStatus === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
            Loading scheduled tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CheckSquare className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No tasks in this view</h3>
            <p className="mt-1 text-xs text-slate-500">
              You're all caught up! Add a new task or deadline anytime.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === "completed";
              const isUrgent = task.priority === "high" && !isCompleted;
              const hasDueDate = !!task.dueDate;

              return (
                <div
                  key={task._id}
                  className={`flex items-start justify-between p-4 sm:px-6 transition ${
                    isCompleted ? "bg-slate-50/50 opacity-70" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleTaskStatus(task)}
                      className="mt-0.5 text-slate-400 hover:text-slate-900 transition"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-bold ${
                            isCompleted ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${
                            task.priority === "high"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : task.priority === "medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Due Date Indicator */}
                      {hasDueDate && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteTaskId(task._id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition shrink-0"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task or Deadline"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. File Q3 Estimated Tax Return"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description / Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, steps, or reference files..."
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High / Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="Financial">Financial / Tax</option>
                <option value="Health">Health & Medical</option>
                <option value="Personal">Personal Life</option>
                <option value="Work">Professional / Work</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Schedule Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to remove this task from your schedule?"
      />
    </div>
  );
}

export default Tasks;
