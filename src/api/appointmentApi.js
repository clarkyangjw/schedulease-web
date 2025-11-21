import apiConfig from "./config";

const API_BASE_URL = apiConfig.baseURL;
const APPOINTMENTS_ENDPOINT = apiConfig.endpoints.appointments;

/**
 * Fetch all appointments, optionally filtered by time range
 * @param {number} [startTime] - Optional start time timestamp (seconds)
 * @param {number} [endTime] - Optional end time timestamp (seconds)
 * @returns {Promise<Array>} Array of appointment objects
 */
export const getAllAppointments = async (startTime = null, endTime = null) => {
    try {
        // Build query string if time range is provided
        let url = `${API_BASE_URL}${APPOINTMENTS_ENDPOINT}`;
        if (startTime != null && endTime != null) {
            // Convert to seconds if in milliseconds (backend expects seconds)
            const startTimeSeconds =
                startTime >= 10000000000
                    ? Math.floor(startTime / 1000)
                    : startTime;
            const endTimeSeconds =
                endTime >= 10000000000 ? Math.floor(endTime / 1000) : endTime;
            url += `?startTime=${startTimeSeconds}&endTime=${endTimeSeconds}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch appointments: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

/**
 * Fetch a single appointment by ID
 * @param {number} id - Appointment ID
 * @returns {Promise<Object>} Appointment object
 */
export const getAppointmentById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${APPOINTMENTS_ENDPOINT}/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch appointment: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching appointment:", error);
        throw error;
    }
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment data (clientId, providerId, serviceId, startTime in seconds, notes)
 * @returns {Promise<Object>} Created appointment object
 */
export const createAppointment = async (appointmentData) => {
    try {
        // Ensure startTime is in seconds (convert from milliseconds if needed)
        const dataToSend = { ...appointmentData };
        if (dataToSend.startTime >= 10000000000) {
            dataToSend.startTime = Math.floor(dataToSend.startTime / 1000);
        }

        const response = await fetch(
            `${API_BASE_URL}${APPOINTMENTS_ENDPOINT}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    `Failed to create appointment: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;
    }
};

/**
 * Update appointment status
 * @param {number} id - Appointment ID
 * @param {string} status - New status (CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
 * @param {string} cancellationReason - Optional cancellation reason
 * @returns {Promise<Object>} Updated appointment object
 */
export const updateAppointmentStatus = async (
    id,
    status,
    cancellationReason = null
) => {
    try {
        const requestBody = { status };
        if (cancellationReason) {
            requestBody.cancellationReason = cancellationReason;
        }

        const response = await fetch(
            `${API_BASE_URL}${APPOINTMENTS_ENDPOINT}/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    `Failed to update appointment status: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating appointment status:", error);
        throw error;
    }
};

/**
 * Delete an appointment by ID
 * @param {number} id - Appointment ID
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${APPOINTMENTS_ENDPOINT}/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to delete appointment: ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Error deleting appointment:", error);
        throw error;
    }
};
