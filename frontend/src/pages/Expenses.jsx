import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch expenses from backend on load
  useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setIsLoading(false);
      });
  }, []);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Send new expense to backend
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, amount: newAmount }),
      });

      const addedExpense = await response.json();
      
      // Update UI with the new expense from the server
      setExpenses([addedExpense, ...expenses]);
      setNewName("");
      setNewAmount("");
      setIsAdding(false);
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Expenses</h1>
            <p className="mt-1 text-slate-600">Track your spending and financial health.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Total Spent</p>
            <p className="text-3xl font-bold text-slate-900">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
        </header>

        <div className="mb-6 flex justify-between items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            {isAdding ? "Cancel" : "+ Add Expense"}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddExpense} className="mb-6 flex items-end gap-4 rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-inner">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Coffee, Rent" 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              Save
            </button>
          </form>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 animate-pulse">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No expenses recorded yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">💳</div>
                    <div>
                      <p className="font-medium text-slate-900">{expense.name}</p>
                      <p className="text-xs text-slate-500">{expense.date}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-slate-900">${expense.amount.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </main>
    </div>
  );
}

export default Expenses;