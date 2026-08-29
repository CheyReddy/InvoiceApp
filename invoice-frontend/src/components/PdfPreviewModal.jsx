import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { Download } from "lucide-react";

export default function PdfPreviewModal({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
}) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !invoiceId) return;

    let objectUrl;
    setLoading(true);
    setError("");
    setPdfUrl(null);

    axiosInstance
      .get(`/invoices/${invoiceId}/pdf`, { responseType: "blob" })
      .then((res) => {
        objectUrl = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" }),
        );
        setPdfUrl(objectUrl);
      })
      .catch(() => setError("Failed to load PDF preview"))
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, invoiceId]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", `${invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl h-[85vh] flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {invoiceNumber} — Preview
          </h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              aria-label="Download"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              Loading preview...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          ) : (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="Invoice PDF Preview"
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
