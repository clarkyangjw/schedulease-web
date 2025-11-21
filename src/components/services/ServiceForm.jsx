import { useState, useEffect } from "react";

const CATEGORIES = [
    { value: "HAIRCUT", label: "Haircut" },
    { value: "MASSAGE", label: "Massage" },
];

function ServiceForm({ service, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        duration: "",
        price: "",
        isActive: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name || "",
                description: service.description || "",
                category: service.category || "",
                duration: service.duration || "",
                price: service.price || "",
                isActive: service.isActive !== undefined ? service.isActive : true,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                category: "",
                duration: "",
                price: "",
                isActive: true,
            });
        }
    }, [service]);

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
        if (!formData.name.trim()) {
            newErrors.name = "Service name is required";
        }
        if (!formData.category) {
            newErrors.category = "Category is required";
        }
        if (!formData.duration || formData.duration <= 0) {
            newErrors.duration = "Duration must be greater than 0";
        }
        if (formData.price && formData.price < 0) {
            newErrors.price = "Price must be non-negative";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const submitData = {
                ...formData,
                duration: parseInt(formData.duration, 10),
                price: formData.price ? parseFloat(formData.price) : null,
            };
            onSave(submitData);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neutral-800">
                        {service ? "Edit Service" : "New Service"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-neutral-500 hover:text-neutral-700">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-neutral-300"
                            }`}
                            placeholder="Enter service name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
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
                            placeholder="Enter service description"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-neutral-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                    errors.category
                                        ? "border-red-500"
                                        : "border-neutral-300"
                                }`}>
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.category}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="duration"
                                className="block text-sm font-medium text-neutral-700 mb-1">
                                Duration (minutes){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                max="1440"
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                    errors.duration
                                        ? "border-red-500"
                                        : "border-neutral-300"
                                }`}
                                placeholder="Enter duration in minutes"
                            />
                            {errors.duration && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.duration}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-neutral-700 mb-1">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                errors.price
                                    ? "border-red-500"
                                    : "border-neutral-300"
                            }`}
                            placeholder="Enter price (optional)"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.price}
                            </p>
                        )}
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
                            {service ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ServiceForm;

