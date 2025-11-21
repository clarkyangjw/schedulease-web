import apiConfig from "./config";

const API_BASE_URL = apiConfig.baseURL;
const SERVICES_ENDPOINT = apiConfig.endpoints.services;

/**
 * Fetch all services
 * @param {boolean} activeOnly - Optional: filter by active status
 * @param {string} category - Optional: filter by category (HAIRCUT, MASSAGE)
 * @returns {Promise<Array>} Array of service objects
 */
export const getAllServices = async (activeOnly = null, category = null) => {
    try {
        const params = new URLSearchParams();
        if (activeOnly !== null) {
            params.append("activeOnly", activeOnly);
        }
        if (category) {
            params.append("category", category);
        }

        const queryString = params.toString();
        const url = queryString
            ? `${API_BASE_URL}${SERVICES_ENDPOINT}?${queryString}`
            : `${API_BASE_URL}${SERVICES_ENDPOINT}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
};

/**
 * Fetch a single service by ID
 * @param {number} id - Service ID
 * @returns {Promise<Object>} Service object
 */
export const getServiceById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${SERVICES_ENDPOINT}/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch service: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching service:", error);
        throw error;
    }
};

/**
 * Create a new service
 * @param {Object} serviceData - Service data (name, description, category, duration, price, isActive)
 * @returns {Promise<Object>} Created service object
 */
export const createService = async (serviceData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${SERVICES_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    `Failed to create service: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};

/**
 * Update an existing service
 * @param {number} id - Service ID
 * @param {Object} serviceData - Updated service data
 * @returns {Promise<Object>} Updated service object
 */
export const updateService = async (id, serviceData) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${SERVICES_ENDPOINT}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(serviceData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    `Failed to update service: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating service:", error);
        throw error;
    }
};

/**
 * Delete (deactivate) a service by ID
 * @param {number} id - Service ID
 * @returns {Promise<void>}
 */
export const deleteService = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${SERVICES_ENDPOINT}/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete service: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};
