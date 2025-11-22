// API Configuration
// In development, use relative paths (proxy handles it)
// In production:
//   - If VITE_API_BASE_URL is set, use it (for separate frontend/backend)
//   - Otherwise use relative paths (for integrated deployment in same server)
const API_BASE_URL = import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL || ""
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
