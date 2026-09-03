import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getInvoices } from "../api/invoiceApi.js";
import { getDashboardStats } from "../api/dashboardApi.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  SENT: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  PAID: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

export default function DashboardPage() {
  const { email } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getInvoices()
      .then((res) => setInvoices(res.data))
      .finally(() => setLoading(false));

    getDashboardStats()
      .then((res) => setStats(res.data))
      .finally(() => setStatsLoading(false));
  }, []);

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto h-full p-4 sm:p-8 flex flex-col">
        <div className="mb-8 sticky z-20 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/hub"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span className="sm:hidden">← Back</span>
              <span className="hidden sm:inline">← Back to Dashboard</span>
            </Link>
            <ThemeToggle />
          </div>
          <div className="text-left">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
              InvoiceApp Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Logged in as {email}
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Outstanding
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {statsLoading
                  ? "—"
                  : `${stats?.currencySymbol ?? "$"}${Number(stats?.outstanding ?? 0).toFixed(2)}`}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Sent + Overdue invoices
                {stats?.currencyCode
                  ? ` · converted to ${stats.currencyCode}`
                  : ""}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Paid
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {statsLoading
                  ? "—"
                  : `${stats?.currencySymbol ?? "$"}${Number(stats?.paid ?? 0).toFixed(2)}`}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Total collected
                {stats?.currencyCode
                  ? ` · converted to ${stats.currencyCode}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 mb-8">
            <Link
              to="/invoices/new"
              className="flex-1 bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 text-sm sm:text-base text-center"
            >
              + New Invoice
            </Link>
            <Link
              to="/clients"
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base text-center"
            >
              Manage Clients
            </Link>
            <Link
              to="/invoices"
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base text-center"
            >
              All Invoices
            </Link>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Recent Invoices
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <LoadingSpinner size="sm" text="Loading..." fullScreen />
              ) : recentInvoices.length === 0 ? (
                <p className="p-6 text-gray-500 dark:text-gray-400 text-sm">
                  No invoices yet.{" "}
                  <Link
                    to="/invoices/new"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create your first one
                  </Link>
                  .
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                      <tr>
                        <th className="px-4 py-3">Invoice #</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((inv) => (
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
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status]}`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white whitespace-nowrap">
                            {inv.currencySymbol}
                            {Number(inv.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {invoices.length > 5 && (
              <div className="text-right mt-3">
                <Link
                  to="/invoices"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all {invoices.length} invoices →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
