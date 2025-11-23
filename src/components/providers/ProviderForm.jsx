import { useState, useEffect } from "react";
import WorkDays from "../common/WorkDays";

function ProviderForm({ provider, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        description: "",
        isActive: true,
        availability: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (provider) {
            setFormData({
                firstName: provider.firstName || "",
                lastName: provider.lastName || "",
                description: provider.description || "",
                isActive: provider.isActive !== undefined ? provider.isActive : true,
                availability: provider.availability || "",
            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                description: "",
                isActive: true,
                availability: "",
            });
        }
    }, [provider]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neutral-800">
                        {provider ? "Edit Provider" : "New Provider"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-neutral-500 hover:text-neutral-700">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-neutral-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                    errors.firstName
                                        ? "border-red-500"
                                        : "border-neutral-300"
                                }`}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-neutral-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                    errors.lastName
                                        ? "border-red-500"
                                        : "border-neutral-300"
                                }`}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter provider description"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="availability"
                            className="block text-sm font-medium text-neutral-700 mb-2">
                            Availability
                        </label>
                        <WorkDays
                            workDays={formData.availability}
                            editable={true}
                            onChange={(value) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    availability: value,
                                }));
                            }}
                        />
                        <p className="text-xs text-neutral-500 mt-2">
                            Click on the day labels to select available days
                        </p>
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary/50"
                            />
                            <span className="text-sm font-medium text-neutral-700">
                                Active
                            </span>
                        </label>
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
                            {provider ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProviderForm;

