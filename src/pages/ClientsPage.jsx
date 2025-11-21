import { useState, useEffect } from "react";
import ClientForm from "../components/clients/ClientForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
} from "../api/clientApi";

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllClients();
            setClients(data);
        } catch (err) {
            setError("Failed to load clients. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewClient = () => {
        setEditingClient(null);
        setShowForm(true);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setClientToDelete(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (clientToDelete) {
            try {
                await deleteClient(clientToDelete);
                loadClients();
                setShowDeleteDialog(false);
                setClientToDelete(null);
            } catch (err) {
                alert("Failed to delete client. Please try again.");
                console.error(err);
                setShowDeleteDialog(false);
                setClientToDelete(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setClientToDelete(null);
    };

    const handleSave = async (clientData) => {
        try {
            if (editingClient) {
                await updateClient(editingClient.id, clientData);
            } else {
                await createClient(clientData);
            }
            setShowForm(false);
            setEditingClient(null);
            loadClients();
        } catch (err) {
            alert(
                `Failed to ${
                    editingClient ? "update" : "create"
                } client. Please try again.`
            );
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingClient(null);
    };

    return (
        <section id="content-clients">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-xl font-bold text-neutral-800">
                        Clients
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        Manage and view all client information
                    </p>
                </div>
                <button
                    onClick={handleNewClient}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                    <i className="fas fa-plus mr-1"></i>
                    New Client
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-neutral-500">Loading clients...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-200">
                        <h3 className="font-semibold text-neutral-800">
                            Client List
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Client ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-8 text-center text-sm text-neutral-500">
                                            No clients found
                                        </td>
                                    </tr>
                                ) : (
                                    clients
                                        .sort((a, b) => a.id - b.id)
                                        .map((client) => (
                                            <tr
                                                key={client.id}
                                                className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    #{client.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-neutral-800">
                                                                {
                                                                    client.firstName
                                                                }{" "}
                                                                {
                                                                    client.lastName
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {client.phone || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(client)
                                                        }
                                                        className="text-primary hover:text-primary/80 mr-3">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                client.id
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showForm && (
                <ClientForm
                    client={editingClient}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Client"
                message="Are you sure you want to delete this client? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </section>
    );
}

export default ClientsPage;
