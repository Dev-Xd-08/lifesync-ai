const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- TEMPORARY IN-MEMORY DATABASES ---
let expenses = [
  { id: 1, name: "Groceries", amount: 120.50, date: "2026-09-08" },
  { id: 2, name: "Netflix Subscription", amount: 15.99, date: "2026-09-05" }
];

let documents = [
  { id: 1, name: "Tax_Return_2025.pdf", size: "2.4 MB", date: "2026-09-01" },
  { id: 2, name: "Health_Insurance_Policy.pdf", size: "1.1 MB", date: "2026-09-03" }
];

// --- ROUTES ---

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "LifeSync AI Server is running!" });
});

// Expenses Routes
app.get("/api/expenses", (req, res) => res.json(expenses));
app.post("/api/expenses", (req, res) => {
  const { name, amount } = req.body;
  if (!name || !amount) return res.status(400).json({ error: "Missing fields" });
  
  const newExpense = { id: Date.now(), name, amount: parseFloat(amount), date: new Date().toISOString().split("T")[0] };
  expenses.unshift(newExpense);
  res.status(201).json(newExpense);
});

// Documents Routes (NEW)
app.get("/api/documents", (req, res) => res.json(documents));
app.post("/api/documents", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Document name is required" });

  const newDoc = {
    id: Date.now(),
    name: name.includes(".") ? name : `${name}.pdf`, // Auto-append .pdf if no extension
    size: (Math.random() * 5 + 0.1).toFixed(1) + " MB", // Fake file size
    date: new Date().toISOString().split("T")[0]
  };
  
  documents.unshift(newDoc);
  res.status(201).json(newDoc);
});

// GET dashboard stats (UPDATED)
app.get("/api/stats", (req, res) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  res.json({
    totalDocuments: documents.length, // Now counts real documents
    totalExpenses: totalExpenses,
    pendingTasks: 5 // Still hardcoded for now    
  });
});

// Chat route (processes user messages)
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required." });

  const cleanMessage = message.toLowerCase();
  let aiReply = "I am processing your digital records. Could you be more specific?";

  // Make the AI read from the real 'expenses' array
  if (cleanMessage.includes("expense") || cleanMessage.includes("spend") || cleanMessage.includes("total")) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseCount = expenses.length;
    aiReply = `Based on your records, you have ${expenseCount} expenses totaling $${totalExpenses.toFixed(2)}.`;
  } 
  // Make the AI read from the real 'documents' array
  else if (cleanMessage.includes("document") || cleanMessage.includes("file") || cleanMessage.includes("vault")) {
    const docCount = documents.length;
    
    if (docCount === 0) {
      aiReply = "Your document vault is currently empty. Would you like to upload something?";
    } else {
      // Get the names of the documents to show the user
      const docNames = documents.map(d => d.name).join(", ");
      aiReply = `You have ${docCount} documents in your vault. Your recent files include: ${docNames}.`;
    }
  } 
  // Catch-all response
  else {
    aiReply = `I received: "${message}". Try asking me "What are my total expenses?" or "What documents do I have?"`;
  }

  // Simulate a slight delay so it feels like the AI is "thinking"
  setTimeout(() => {
    res.json({ reply: aiReply });
  }, 800);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});