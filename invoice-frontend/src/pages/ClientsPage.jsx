import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../api/clientApi.js";
import ClientFormModal from "../components/ClientFormModal.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [error, setError] = useState("");

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await getClients();
      setClients(res.data);
    } catch (err) {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAdd = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const handleSubmit = async (data) => {
    if (editingClient) {
      const res = await updateClient(editingClient.id, data);
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? res.data : c)),
      );
    } else {
      const res = await createClient(data);
      setClients((prev) => [...prev, res.data]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
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
              Clients
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              + Add Client
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading clients...</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : clients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
            No clients yet. Add your first one to get started.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-t border-gray-100 dark:border-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[160px] break-words">
                        {client.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[200px] break-words">
                        {client.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[220px] break-words">
                        {client.address || "—"}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ClientFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingClient}
      />
    </div>
  );
}
