import { useState, useEffect } from "react";
import { getAllClients } from "../../api/clientApi";
import { getAllProviders } from "../../api/providerApi";
import { getAllServices } from "../../api/serviceApi";
import { getAllAppointments, getAvailableProviders } from "../../api/appointmentApi";

const STATUS_OPTIONS = [
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "NO_SHOW", label: "No Show" },
];

function AppointmentForm({ appointment, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        clientId: "",
        providerId: "",
        serviceId: "",
        startTime: "",
        status: "CONFIRMED",
        notes: "",
        cancellationReason: "",
    });

    const [clients, setClients] = useState([]);
    const [availableProviders, setAvailableProviders] = useState([]); // Available providers from API
    const [services, setServices] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingProviders, setLoadingProviders] = useState(false);

    useEffect(() => {
        loadOptions();
    }, []);

    useEffect(() => {
        if (appointment) {
            console.log("Loading appointment into form:", appointment);

            // Ensure startTime is a number (backend returns seconds)
            let startTime = appointment.startTime;
            if (typeof startTime === "string") {
                startTime = parseInt(startTime, 10);
            }
            // Backend always returns seconds, convert to milliseconds for Date object
            // Check if it's already in milliseconds (unlikely but safe)
            if (startTime >= 10000000000) {
                // Already in milliseconds, convert to seconds first
                startTime = Math.floor(startTime / 1000);
            }
            // Now convert seconds to milliseconds for Date object
            startTime = startTime * 1000;

            // Convert timestamp to datetime-local format
            const startDate = new Date(startTime);
            const localDateTime = new Date(
                startDate.getTime() - startDate.getTimezoneOffset() * 60000
            )
                .toISOString()
                .slice(0, 16);

            console.log("Form data being set:", {
                clientId: appointment.clientId?.toString() || "",
                providerId: appointment.providerId?.toString() || "",
                serviceId: appointment.serviceId?.toString() || "",
                startTime: localDateTime,
                status: appointment.status || "CONFIRMED",
            });

            const formDataToSet = {
                clientId: appointment.clientId?.toString() || "",
                providerId: appointment.providerId?.toString() || "",
                serviceId: appointment.serviceId?.toString() || "",
                startTime: localDateTime,
                status: appointment.status || "CONFIRMED",
                notes: appointment.notes || "",
                cancellationReason: appointment.cancellationReason || "",
            };

            setFormData(formDataToSet);

            // Load available providers when loading appointment (for edit mode)
            if (localDateTime && appointment.serviceId) {
                // Use setTimeout to ensure services are loaded
                setTimeout(() => {
                    loadAvailableProviders(localDateTime, appointment.serviceId);
                }, 100);
            }
        }
    }, [appointment]);

    const loadOptions = async () => {
        try {
            setLoading(true);
            const [clientsData, servicesData] =
                await Promise.all([
                    getAllClients(),
                    getAllServices(true), // activeOnly
                ]);
            setClients(clientsData);
            setServices(servicesData);
            setAvailableProviders([]); // Initially empty, will be loaded when time and service are selected
        } catch (error) {
            console.error("Error loading options:", error);
            alert("Failed to load form options. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    // Load available providers from backend API
    const loadAvailableProviders = async (startTimeValue, serviceIdValue) => {
        if (!startTimeValue || !serviceIdValue) {
            setAvailableProviders([]);
            return;
        }

        try {
            setLoadingProviders(true);
            // Convert datetime-local to timestamp (seconds)
            const startDate = new Date(startTimeValue);
            const timestampMs = startDate.getTime();
            const timestampSeconds = Math.floor(timestampMs / 1000);

            const providers = await getAvailableProviders(timestampSeconds, parseInt(serviceIdValue, 10));
            setAvailableProviders(providers);

            // If currently selected provider is not in available list, clear it
            if (
                formData.providerId &&
                !providers.find((p) => p.id.toString() === formData.providerId)
            ) {
                setFormData((prev) => ({
                    ...prev,
                    providerId: "",
                }));
            }
        } catch (error) {
            console.error("Error loading available providers:", error);
            setAvailableProviders([]);
            alert("Failed to load available providers. Please try again.");
        } finally {
            setLoadingProviders(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };

        // When startTime changes, clear provider and reload available providers if service is already selected
        if (name === "startTime") {
            newFormData.providerId = ""; // Clear provider when time changes
            // Keep serviceId if already selected
            if (formData.serviceId) {
                // If service is already selected, reload providers with new time
                setTimeout(() => {
                    loadAvailableProviders(value, formData.serviceId);
                }, 0);
            } else {
                setAvailableProviders([]);
            }
        }

        // When service changes, clear provider and reload available providers if startTime is already selected
        if (name === "serviceId") {
            newFormData.providerId = ""; // Clear provider when service changes
            if (value && formData.startTime) {
                // Load available providers for the selected time and service
                loadAvailableProviders(formData.startTime, value);
            } else {
                setAvailableProviders([]);
            }
        }

        setFormData(newFormData);

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.clientId) {
            newErrors.clientId = "Client is required";
        }
        if (!formData.providerId) {
            newErrors.providerId = "Provider is required";
        }
        if (!formData.serviceId) {
            newErrors.serviceId = "Service is required";
        }
        if (!formData.startTime) {
            newErrors.startTime = "Start time is required";
        }
        if (
            formData.status === "CANCELLED" &&
            !formData.cancellationReason.trim()
        ) {
            newErrors.cancellationReason = "Cancellation reason is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Convert datetime-local to timestamp (milliseconds)
            const startDate = new Date(formData.startTime);
            const timestampMs = startDate.getTime();
            // Convert to seconds (backend expects seconds)
            const timestampSeconds = Math.floor(timestampMs / 1000);

            const submitData = {
                clientId: parseInt(formData.clientId, 10),
                providerId: parseInt(formData.providerId, 10),
                serviceId: parseInt(formData.serviceId, 10),
                startTime: timestampSeconds,
                notes: formData.notes || null,
            };

            // If editing and status changed, include status update
            if (appointment) {
                submitData.status = formData.status;
                if (formData.status === "CANCELLED") {
                    submitData.cancellationReason =
                        formData.cancellationReason || null;
                }
            }

            onSave(submitData);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <p className="text-neutral-500">Loading form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neutral-800">
                        {appointment ? "Edit Appointment" : "New Appointment"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-neutral-500 hover:text-neutral-700">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Client */}
                    <div className="mb-4">
                        <label
                            htmlFor="clientId"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Client <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="clientId"
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                errors.clientId
                                    ? "border-red-500"
                                    : "border-neutral-300"
                            }`}>
                            <option value="">Select client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.firstName} {client.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.clientId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.clientId}
                            </p>
                        )}
                    </div>

                    {/* Step 2: Start Time */}
                    <div className="mb-4">
                        <label
                            htmlFor="startTime"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Start Time{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            disabled={!formData.clientId}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                errors.startTime
                                    ? "border-red-500"
                                    : "border-neutral-300"
                            } ${!formData.clientId ? "bg-neutral-100 cursor-not-allowed" : ""}`}
                        />
                        {errors.startTime && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.startTime}
                            </p>
                        )}
                        {!formData.clientId && (
                            <p className="text-neutral-500 text-xs mt-1">
                                Please select a client first
                            </p>
                        )}
                    </div>

                    {/* Step 3: Service */}
                    <div className="mb-4">
                        <label
                            htmlFor="serviceId"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="serviceId"
                            name="serviceId"
                            value={formData.serviceId}
                            onChange={handleChange}
                            disabled={!formData.startTime}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                errors.serviceId
                                    ? "border-red-500"
                                    : "border-neutral-300"
                            } ${!formData.startTime ? "bg-neutral-100 cursor-not-allowed" : ""}`}>
                            <option value="">
                                {!formData.startTime
                                    ? "Select start time first"
                                    : "Select service"}
                            </option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} ({service.duration} min)
                                </option>
                            ))}
                        </select>
                        {errors.serviceId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.serviceId}
                            </p>
                        )}
                        {!formData.startTime && (
                            <p className="text-neutral-500 text-xs mt-1">
                                Please select a start time first
                            </p>
                        )}
                    </div>

                    {/* Step 4: Provider (filtered by startTime and service) */}
                    <div className="mb-4">
                        <label
                            htmlFor="providerId"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Provider <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="providerId"
                            name="providerId"
                            value={formData.providerId}
                            onChange={handleChange}
                            disabled={!formData.serviceId || loadingProviders}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                errors.providerId
                                    ? "border-red-500"
                                    : "border-neutral-300"
                            } ${!formData.serviceId || loadingProviders ? "bg-neutral-100 cursor-not-allowed" : ""}`}>
                            <option value="">
                                {loadingProviders
                                    ? "Loading available providers..."
                                    : !formData.serviceId
                                    ? "Select service first"
                                    : availableProviders.length === 0
                                    ? "No available providers for this time slot"
                                    : "Select provider"}
                            </option>
                            {availableProviders.map((provider) => (
                                <option
                                    key={provider.id}
                                    value={provider.id}>
                                    {provider.firstName} {provider.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.providerId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.providerId}
                            </p>
                        )}
                        {formData.serviceId &&
                            !loadingProviders &&
                            availableProviders.length === 0 && (
                                <p className="text-orange-500 text-xs mt-1">
                                    No providers are available for this time slot and service duration
                                </p>
                            )}
                    </div>
                    {appointment && (
                        <div className="mb-4">
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-neutral-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                                {STATUS_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {formData.status === "CANCELLED" && (
                        <div className="mb-4">
                            <label
                                htmlFor="cancellationReason"
                                className="block text-sm font-medium text-neutral-700 mb-1">
                                Cancellation Reason{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="cancellationReason"
                                name="cancellationReason"
                                value={formData.cancellationReason}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                    errors.cancellationReason
                                        ? "border-red-500"
                                        : "border-neutral-300"
                                }`}
                                placeholder="Enter cancellation reason"
                            />
                            {errors.cancellationReason && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.cancellationReason}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="mb-6">
                        <label
                            htmlFor="notes"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter appointment notes (optional)"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm transition-colors">
                            {appointment ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentForm;
