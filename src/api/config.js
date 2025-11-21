// API Configuration
// In development, use relative paths (proxy handles it)
// In production, use full URL from env variable
const API_BASE_URL = import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
    : "";

export const apiConfig = {
    baseURL: API_BASE_URL,
    endpoints: {
        clients: "/api/clients",
        providers: "/api/providers",
        services: "/api/services",
        appointments: "/api/appointments",
    },
};

export default apiConfig;
