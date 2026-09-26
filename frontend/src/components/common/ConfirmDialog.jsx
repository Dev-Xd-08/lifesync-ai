import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", isDestructive = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDestructive ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">
          {message}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
            isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
