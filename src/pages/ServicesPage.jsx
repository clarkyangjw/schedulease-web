import { useState, useEffect } from "react";
import ServiceForm from "../components/services/ServiceForm";
import {
    getAllServices,
    createService,
    updateService,
} from "../api/serviceApi";

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllServices();
            setServices(data);
        } catch (err) {
            setError("Failed to load services. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewService = () => {
        setEditingService(null);
        setShowForm(true);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setShowForm(true);
    };

    const handleSave = async (serviceData) => {
        try {
            if (editingService) {
                await updateService(editingService.id, serviceData);
            } else {
                await createService(serviceData);
            }
            setShowForm(false);
            setEditingService(null);
            loadServices();
        } catch (err) {
            alert(
                `Failed to ${
                    editingService ? "update" : "create"
                } service. Please try again.`
            );
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingService(null);
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return "-";
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) {
            return `${hours} ${hours === 1 ? "hour" : "hours"}`;
        }
        return `${hours}h ${mins}m`;
    };

    return (
        <section id="content-services">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-xl font-bold text-neutral-800">
                        Services
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        Manage and view all service information
                    </p>
                </div>
                <button
                    onClick={handleNewService}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                    <i className="fas fa-plus mr-1"></i>
                    New Service
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-neutral-500">Loading services...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-200">
                        <h3 className="font-semibold text-neutral-800">
                            Service List
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
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Price
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
                                {services.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-8 text-center text-sm text-neutral-500">
                                            No services found
                                        </td>
                                    </tr>
                                ) : (
                                    services
                                        .sort((a, b) => a.id - b.id)
                                        .map((service) => (
                                            <tr
                                                key={service.id}
                                                className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    #{service.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-neutral-800">
                                                        {service.name}
                                                    </div>
                                                    {service.description && (
                                                        <div className="text-xs text-neutral-500 mt-1 max-w-xs truncate">
                                                            {service.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {service.category ===
                                                        "HAIRCUT"
                                                            ? "Haircut"
                                                            : "Massage"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {formatDuration(
                                                        service.duration
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {formatPrice(service.price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            service.isActive
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}>
                                                        {service.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(service)
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
                <ServiceForm
                    service={editingService}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </section>
    );
}

export default ServicesPage;
