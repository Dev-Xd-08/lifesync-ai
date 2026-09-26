import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PlusCircle,
  FolderLock,
  Receipt,
  HeartPulse,
  Trash2,
  Check
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDate } from "../utils/formatters";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Task");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const { showToast } = useToast();

  const fetchReminders = async () => {
    try {
      // Gather events from tasks and expiring documents
      const [tasksRes, docsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/documents")
      ]);

      const events = [];

      // 1. Task Reminders
      if (tasksRes.data.success) {
        tasksRes.data.tasks.forEach((t) => {
          if (t.dueDate) {
            events.push({
              id: `task-${t._id}`,
              rawId: t._id,
              source: "task",
              title: t.title,
              category: t.category || "Task",
              date: t.dueDate,
              priority: t.priority,
              status: t.status === "completed" ? "resolved" : "active",
              type: "Task Deadline"
            });
          }
        });
      }

      // 2. Document Expiry Reminders
      if (docsRes.data.success) {
        docsRes.data.documents.forEach((d) => {
          if (d.extractedMetadata?.expiryDate) {
            events.push({
              id: `doc-${d._id}`,
              rawId: d._id,
              source: "document",
              title: `${d.title} (Vault Expiry)`,
              category: d.category || "Document",
              date: d.extractedMetadata.expiryDate,
              priority: "high",
              status: "active",
              type: "Document Expiry"
            });
          }
        });
      }

      // Prepend custom scheduled payments / health appointments
      events.push(
        {
          id: "custom-rent",
          title: "Monthly Apartment Rent Payment",
          category: "Financial",
          date: new Date(Date.now() + 86400000 * 4),
          priority: "high",
          status: "active",
          type: "Payment"
        },
        {
          id: "custom-health",
          title: "Annual Preventative Dental Cleaning",
          category: "Medical",
          date: new Date(Date.now() + 86400000 * 12),
          priority: "medium",
          status: "active",
          type: "Health Appointment"
        }
      );

      // Sort by date ascending
      events.sort((a, b) => new Date(a.date) - new Date(b.date));
      setReminders(events);
    } catch (err) {
      showToast("Error loading reminders.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDismiss = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
    showToast("Reminder acknowledged and archived.", "success");
  };

  const handleCreateReminder = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      showToast("Please provide both title and reminder date.", "error");
      return;
    }

    const newReminder = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: type,
      date: new Date(dueDate),
      priority: "medium",
      status: "active",
      type: type
    };

    setReminders((prev) => [newReminder, ...prev]);
    showToast("Custom reminder scheduled.", "success");
    setIsModalOpen(false);
    setTitle("");
    setDueDate("");
    setNotes("");
  };

  const filteredReminders = reminders.filter((r) => {
    if (filterType === "active") return r.status === "active";
    if (filterType === "resolved") return r.status === "resolved";
    if (filterType === "urgent") return r.priority === "high" && r.status === "active";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Event & Expiry Reminders</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
              {reminders.filter((r) => r.status === "active").length} Active
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Proactive alerts for upcoming document expirations, task deadlines, and payments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
        >
          <PlusCircle className="h-4 w-4 text-emerald-400" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xs">
        {[
          { id: "all", label: `All Reminders (${reminders.length})` },
          { id: "active", label: "Active" },
          { id: "urgent", label: "Urgent Alerts" },
          { id: "resolved", label: "Resolved" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              filterType === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingSpinner label="Polling upcoming life reminders..." />
        ) : filteredReminders.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No reminders in this view"
            description="All upcoming deadlines and document expirations are on schedule."
            actionText="Schedule a Reminder"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReminders.map((rem) => {
              const isResolved = rem.status === "resolved";
              const isUrgent = rem.priority === "high" && !isResolved;
              const daysLeft = Math.ceil(
                (new Date(rem.date) - new Date()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={rem.id}
                  className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition ${
                    isResolved ? "bg-slate-50/50 opacity-60" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-2xs ${
                        rem.type === "Document Expiry"
                          ? "bg-cyan-50 text-cyan-700"
                          : rem.type === "Payment"
                          ? "bg-emerald-50 text-emerald-700"
                          : rem.type === "Health Appointment"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {rem.type === "Document Expiry" && <FolderLock className="h-5 w-5" />}
                      {rem.type === "Payment" && <Receipt className="h-5 w-5" />}
                      {rem.type === "Health Appointment" && <HeartPulse className="h-5 w-5" />}
                      {rem.type === "Task Deadline" && <CheckSquare className="h-5 w-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-bold ${
                            isResolved ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {rem.title}
                        </h4>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                          {rem.type}
                        </span>
                        {isUrgent && (
                          <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-red-700">
                            Urgent
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(rem.date)}
                        </span>
                        <span
                          className={`font-semibold ${
                            daysLeft < 0
                              ? "text-red-600"
                              : daysLeft <= 3
                              ? "text-amber-600"
                              : "text-slate-500"
                          }`}
                        >
                          {daysLeft < 0
                            ? `Overdue by ${Math.abs(daysLeft)} days`
                            : daysLeft === 0
                            ? "Due today"
                            : `In ${daysLeft} days`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isResolved ? (
                      <button
                        onClick={() => handleDismiss(rem.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Custom Event Reminder"
      >
        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Reminder Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Car Insurance Renewal"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Reminder Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                <option value="Task">Task Deadline</option>
                <option value="Payment">Payment Due</option>
                <option value="Document Expiry">Document Expiry</option>
                <option value="Health Appointment">Health Appointment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                required
              />
            </div>
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
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Set Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Reminders;
