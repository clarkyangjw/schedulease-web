import apiConfig from "./config";

const API_BASE_URL = apiConfig.baseURL;
const CLIENTS_ENDPOINT = apiConfig.endpoints.clients;

/**
 * Fetch all clients
 * @returns {Promise<Array>} Array of client objects
 */
export const getAllClients = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${CLIENTS_ENDPOINT}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch clients: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

/**
 * Fetch a single client by ID
 * @param {number} id - Client ID
 * @returns {Promise<Object>} Client object
 */
export const getClientById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${CLIENTS_ENDPOINT}/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch client: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching client:", error);
        throw error;
    }
};

/**
 * Create a new client
 * @param {Object} clientData - Client data (firstName, lastName, phone)
 * @returns {Promise<Object>} Created client object
 */
export const createClient = async (clientData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${CLIENTS_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create client: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
};

/**
 * Update an existing client
 * @param {number} id - Client ID
 * @param {Object} clientData - Updated client data
 * @returns {Promise<Object>} Updated client object
 */
export const updateClient = async (id, clientData) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${CLIENTS_ENDPOINT}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clientData),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to update client: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating client:", error);
        throw error;
    }
};

/**
 * Delete a client by ID
 * @param {number} id - Client ID
 * @returns {Promise<void>}
 */
export const deleteClient = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${CLIENTS_ENDPOINT}/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete client: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
};
