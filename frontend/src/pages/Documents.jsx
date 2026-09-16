import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        setIsLoading(false);
      });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDocName) return;

    try {
      const response = await fetch("http://localhost:5000/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDocName }),
      });

      const addedDoc = await response.json();
      setDocuments([addedDoc, ...documents]);
      setNewDocName("");
      setIsUploading(false);
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Documents Vault</h1>
            <p className="mt-1 text-slate-600">Securely store and manage your important files.</p>
          </div>
          <button 
            onClick={() => setIsUploading(!isUploading)}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            {isUploading ? "Cancel" : "+ Upload Document"}
          </button>
        </header>

        {isUploading && (
          <form onSubmit={handleUpload} className="mb-6 flex items-end gap-4 rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-inner">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Document Name</label>
              <input 
                type="text" 
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="e.g., Q3_Bank_Statement" 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              Save to Vault
            </button>
          </form>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 animate-pulse">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No documents yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                      📄
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500">Added {doc.date}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    {doc.size}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default Documents;