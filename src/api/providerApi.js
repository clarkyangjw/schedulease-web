import apiConfig from "./config";

const API_BASE_URL = apiConfig.baseURL;
const PROVIDERS_ENDPOINT = apiConfig.endpoints.providers;

/**
 * Fetch all providers
 * @returns {Promise<Array>} Array of provider objects
 */
export const getAllProviders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${PROVIDERS_ENDPOINT}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch providers: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching providers:", error);
        throw error;
    }
};

/**
 * Fetch a single provider by ID
 * @param {number} id - Provider ID
 * @returns {Promise<Object>} Provider object
 */
export const getProviderById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${PROVIDERS_ENDPOINT}/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch provider: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching provider:", error);
        throw error;
    }
};

/**
 * Create a new provider
 * @param {Object} providerData - Provider data (firstName, lastName)
 * @returns {Promise<Object>} Created provider object
 */
export const createProvider = async (providerData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${PROVIDERS_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(providerData),
        });

        if (!response.ok) {
            throw new Error(
                `Failed to create provider: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating provider:", error);
        throw error;
    }
};

/**
 * Update an existing provider
 * @param {number} id - Provider ID
 * @param {Object} providerData - Updated provider data
 * @returns {Promise<Object>} Updated provider object
 */
export const updateProvider = async (id, providerData) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${PROVIDERS_ENDPOINT}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(providerData),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to update provider: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating provider:", error);
        throw error;
    }
};

/**
 * Delete a provider by ID
 * @param {number} id - Provider ID
 * @returns {Promise<void>}
 */
export const deleteProvider = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${PROVIDERS_ENDPOINT}/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to delete provider: ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Error deleting provider:", error);
        throw error;
    }
};
