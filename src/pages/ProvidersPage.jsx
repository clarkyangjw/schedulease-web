import { useState, useEffect } from "react";
import ProviderForm from "../components/providers/ProviderForm";
import {
    getAllProviders,
    createProvider,
    updateProvider,
} from "../api/providerApi";

function ProvidersPage() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllProviders();
            setProviders(data);
        } catch (err) {
            setError("Failed to load providers. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewProvider = () => {
        setEditingProvider(null);
        setShowForm(true);
    };

    const handleEdit = (provider) => {
        setEditingProvider(provider);
        setShowForm(true);
    };

    const handleSave = async (providerData) => {
        try {
            if (editingProvider) {
                await updateProvider(editingProvider.id, providerData);
            } else {
                await createProvider(providerData);
            }
            setShowForm(false);
            setEditingProvider(null);
            loadProviders();
        } catch (err) {
            alert(
                `Failed to ${
                    editingProvider ? "update" : "create"
                } provider. Please try again.`
            );
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProvider(null);
    };

    return (
        <section id="content-providers">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-xl font-bold text-neutral-800">
                        Providers
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        Manage and view all provider information
                    </p>
                </div>
                <button
                    onClick={handleNewProvider}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                    <i className="fas fa-plus mr-1"></i>
                    New Provider
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-neutral-500">Loading providers...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-200">
                        <h3 className="font-semibold text-neutral-800">
                            Provider List
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {providers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-sm text-neutral-500">
                                            No providers found
                                        </td>
                                    </tr>
                                ) : (
                                    providers
                                        .sort((a, b) => a.id - b.id)
                                        .map((provider) => (
                                            <tr
                                                key={provider.id}
                                                className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    #{provider.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-neutral-800">
                                                                {
                                                                    provider.firstName
                                                                }{" "}
                                                                {
                                                                    provider.lastName
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs">
                                                    <div
                                                        className="truncate"
                                                        title={
                                                            provider.description ||
                                                            ""
                                                        }>
                                                        {provider.description ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            provider.isActive
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}>
                                                        {provider.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(provider)
                                                        }
                                                        className="text-primary hover:text-primary/80">
                                                        Edit
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
                <ProviderForm
                    provider={editingProvider}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </section>
    );
}

export default ProvidersPage;
