import { useState, useEffect } from "react";
import {
  Receipt,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Trash2,
  Filter,
  DollarSign,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    totalIncome: 0,
    netSavings: 0,
    categoryBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Add Transaction Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  const { showToast } = useToast();

  const standardCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Education",
    "Healthcare",
    "Entertainment",
    "Housing",
    "Salary",
    "Other"
  ];

  const fetchExpensesAndAnalytics = async () => {
    try {
      const [expRes, analyticsRes] = await Promise.all([
        api.get("/expenses", {
          params: {
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            type: selectedType !== "All" ? selectedType : undefined
          }
        }),
        api.get("/expenses/analytics")
      ]);

      if (expRes.data.success) {
        setExpenses(expRes.data.expenses);
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
    } catch (err) {
      showToast("Error loading financial records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesAndAnalytics();
  }, [selectedCategory, selectedType]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      showToast("Please provide both description and amount.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/expenses", {
        description,
        amount: parseFloat(amount),
        category,
        type: transactionType,
        date
      });

      if (res.data.success) {
        showToast("Transaction logged to ledger successfully.", "success");
        setIsAddModalOpen(false);
        setDescription("");
        setAmount("");
        fetchExpensesAndAnalytics();
      }
    } catch (err) {
      showToast("Failed to save transaction.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/expenses/${deleteId}`);
      if (res.data.success) {
        showToast("Transaction removed from ledger.", "success");
        fetchExpensesAndAnalytics();
      }
    } catch (err) {
      showToast("Error deleting transaction.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Ledger & Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track expenditures, cashflow, and MongoDB aggregated category breakdowns.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
        >
          <PlusCircle className="h-4 w-4 text-emerald-400" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Expenses
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ${analytics.totalSpent.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-slate-400">Total debit volume</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Income
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ${analytics.totalIncome.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-slate-400">Total credit volume</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Net Savings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className={`mt-2 text-2xl font-black ${analytics.netSavings >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
            ${analytics.netSavings.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-slate-400">Cash reserve balance</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
        {/* Type Toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {["All", "expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition ${
                selectedType === t
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t === "expense" ? "Debits" : t === "income" ? "Credits" : "All Types"}
            </button>
          ))}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Category:</span>
          {["All", ...standardCategories.slice(0, 6)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
            Loading financial ledger...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Receipt className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No transactions recorded</h3>
            <p className="mt-1 text-xs text-slate-500">
              Start logging your daily purchases or incoming revenues.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add first transaction</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenses.map((item) => {
              const isIncome = item.type === "income";
              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{item.description}</span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-black ${
                        isIncome ? "text-emerald-700" : "text-slate-900"
                      }`}
                    >
                      {isIncome ? "+" : "-"}${Number(item.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Transaction"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTransactionType("expense")}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                transactionType === "expense"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Expense (Debit)
            </button>
            <button
              type="button"
              onClick={() => setTransactionType("income")}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                transactionType === "income"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Income (Credit)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Whole Foods Groceries, Rent, Salary"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                required
              />
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
                {standardCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Save to Ledger
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Transaction"
        message="Are you sure you want to remove this transaction entry from your financial ledger?"
      />
    </div>
  );
}

export default Expenses;