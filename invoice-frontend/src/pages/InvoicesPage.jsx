import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getInvoices,
  deleteInvoice,
  sendInvoice,
  updateInvoiceStatus,
} from "../api/invoiceApi.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import PdfPreviewModal from "../components/PdfPreviewModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  SENT: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  PAID: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

const getAllowedNextStatuses = (status) => {
  switch (status) {
    case "DRAFT":
      return ["SENT"];
    case "SENT":
      return ["PAID"];
    case "OVERDUE":
      return ["PAID"];
    case "PAID":
      return [];
    default:
      return [];
  }
};

export default function InvoicesPage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  const loadInvoices = async () => {
    setLoading(true);

    try {
      const res = await getInvoices();
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to load invoices:", err);
      setActionError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await deleteInvoice(id);

      setInvoices((prev) => prev.filter((inv) => inv.id !== id));

      toast.success("Invoice deleted successfully!");
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      toast.error(err.response?.data?.error || "Failed to delete invoice.");
    }
  };

  /*

  const handleSend = async (id) => {
    setSendingId(id);

    try {
      await sendInvoice(id);

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: "SENT" } : inv
        )
      );

      toast.success("Invoice sent successfully!");
    } catch (err) {
      console.error("Failed to send invoice:", err);

      if (err.response?.status === 500) {
        toast.error(
          "Unable to send invoice email. Please try again."
        );
      } else if (err.response?.status === 404) {
        toast.error("Invoice not found.");
      } else if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        toast.error(
          "Your session has expired. Please log in again."
        );

        logout();
      } else {
        toast.error(
          err.response?.data?.error ||
            "Failed to send invoice."
        );
      }
    } finally {
      setSendingId(null);
    }
  };
  */

  const handleStatusChange = async (id, status) => {
    try {
      await updateInvoiceStatus(id, {
        id,
        status,
      });

      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
      );

      toast.success("Invoice status updated successfully!");
    } catch (err) {
      console.error("Failed to update invoice status:", err);

      toast.error(
        err.response?.data?.error || "Failed to update invoice status.",
      );
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      <div className="max-w-5xl mx-auto h-full p-4 sm:p-8 flex flex-col">
        {/* Header */}
        <div className="shrink-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link
                to="/dashboard"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span className="sm:hidden">← Back</span>

                <span className="hidden sm:inline">← Back to Dashboard</span>
              </Link>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                Invoices
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                to="/invoices/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 text-center"
              >
                + New Invoice
              </Link>
            </div>
          </div>

          {/* Error */}
          {actionError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {actionError}
            </p>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
          {loading ? (
            <LoadingSpinner size="sm" text="Loading Invoices..." fullScreen />
          ) : invoices.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
              No invoices yet. Create your first one to get started.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {/* Horizontal scrolling for table on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[640px]">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                    <tr>
                      <th className="px-4 py-3">Invoice #</th>

                      <th className="px-4 py-3">Client</th>

                      <th className="px-4 py-3">Due Date</th>

                      <th className="px-4 py-3">Status</th>

                      <th className="px-4 py-3 text-right">Total</th>

                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((inv) => {
                      const allowedStatuses = getAllowedNextStatuses(
                        inv.status,
                      );

                      return (
                        <tr
                          key={inv.id}
                          className="border-t border-gray-100 dark:border-gray-700"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            {inv.invoiceNumber}
                          </td>

                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[180px] break-words">
                            {inv.clientName}
                          </td>

                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {inv.dueDate}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <select
                              value={inv.status}
                              onChange={(e) =>
                                handleStatusChange(inv.id, e.target.value)
                              }
                              disabled={allowedStatuses.length === 0}
                              className={`
                                w-32
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                font-medium
                                ${statusColors[inv.status]}
                                dark:border-gray-600
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                              `}
                            >
                              {/* Current status */}
                              <option value={inv.status}>{inv.status}</option>

                              {/* Allowed next statuses */}
                              {allowedStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white whitespace-nowrap">
                            {inv.currencySymbol}
                            {Number(inv.total).toFixed(2)}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                            <button
                              onClick={() => setPreviewInvoice(inv)}
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                            >
                              PDF
                            </button>

                            {/* Send button temporarily disabled because SMTP is unavailable */}

                            {inv.status === "DRAFT" && (
                              <button
                                onClick={() =>
                                  navigate(`/invoices/${inv.id}/edit`)
                                }
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(inv.id)}
                              className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <PdfPreviewModal
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        invoiceId={previewInvoice?.id}
        invoiceNumber={previewInvoice?.invoiceNumber}
      />
    </div>
  );
}
