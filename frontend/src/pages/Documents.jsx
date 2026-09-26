import { useState, useEffect } from "react";
import {
  FolderLock,
  UploadCloud,
  FileText,
  Download,
  Trash2,
  Search,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  FileUp,
  Tag
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("Other");
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [deleteDocId, setDeleteDocId] = useState(null);

  const { showToast } = useToast();

  const categories = [
    "All",
    "Identity",
    "Education",
    "Finance",
    "Medical",
    "Insurance",
    "Legal",
    "Other"
  ];

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents", {
        params: {
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined
        }
      });
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      showToast("Error loading document vault records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, searchQuery]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please choose a file to upload.", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", docTitle);
    formData.append("category", docCategory);

    try {
      const res = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        showToast("Document saved! OCR metadata and security hash generated.", "success");
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setDocTitle("");
        setDocCategory("Other");
        fetchDocuments();
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to process document upload.";
      showToast(msg, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDocId) return;
    try {
      const res = await api.delete(`/documents/${deleteDocId}`);
      if (res.data.success) {
        showToast("Document permanently shredded from vault.", "success");
        setDocuments((prev) => prev.filter((d) => d._id !== deleteDocId));
      }
    } catch (err) {
      showToast("Error deleting document.", "error");
    } finally {
      setDeleteDocId(null);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/documents/${doc._id}/download`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.originalName || `${doc.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(`Downloaded: ${doc.title}`, "success");
    } catch (err) {
      showToast("Could not download file. Verify server vault storage.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Documents Vault</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
              {documents.length} Encrypted
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Secure, tenant-isolated vault with optical character recognition & expiry monitoring.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
        >
          <UploadCloud className="h-4 w-4 text-emerald-400" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, issuer, or text..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
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

      {/* Documents List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
            Scanning vault records...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FolderLock className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No documents found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Upload tax forms, IDs, policies, or receipts to enable automated OCR extraction.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload your first document</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => {
              const hasExpiry = !!doc.extractedMetadata?.expiryDate;
              return (
                <div
                  key={doc._id}
                  className="flex flex-col gap-4 p-5 hover:bg-slate-50/70 transition md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 shadow-2xs">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                          {doc.category}
                        </span>
                      </div>

                      {/* Extracted Metadata Pills */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {doc.extractedMetadata?.issuer && (
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-slate-400" />
                            {doc.extractedMetadata.issuer}
                          </span>
                        )}
                        {doc.extractedMetadata?.identifierMasked && (
                          <span className="flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            ID: {doc.extractedMetadata.identifierMasked}
                          </span>
                        )}
                        {hasExpiry && (
                          <span className="flex items-center gap-1 text-amber-700 font-semibold">
                            <Calendar className="h-3.5 w-3.5" />
                            Exp: {new Date(doc.extractedMetadata.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>{(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                        <span>Added {new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                      title="Download File"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setDeleteDocId(doc._id)}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete from Vault"
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

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document to Vault"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Document Title
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Health Insurance Policy 2026"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Category
            </label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            >
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select File (PDF, PNG, JPG)
            </label>
            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 hover:border-slate-400 transition bg-slate-50/50">
              <div className="space-y-2 text-center">
                <FileUp className="mx-auto h-8 w-8 text-slate-400" />
                <div className="flex text-xs text-slate-600 justify-center">
                  <label className="relative cursor-pointer rounded-md font-bold text-slate-900 hover:underline">
                    <span>Click to browse</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="sr-only"
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-[11px] text-slate-500">
                  {selectedFile ? (
                    <span className="font-bold text-emerald-700">
                      ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  ) : (
                    "Up to 15MB with automated OCR indexing"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Running OCR Extraction...</span>
                </>
              ) : (
                <span>Upload & Index</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message="Are you sure you want to permanently delete this document from your vault? This will remove the file from encrypted disk storage."
        confirmText="Permanently Shred"
      />
    </div>
  );
}

export default Documents;