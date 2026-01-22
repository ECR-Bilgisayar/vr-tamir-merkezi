const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
    // Service Requests
    createServiceRequest: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/service-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    trackServiceRequest: async (serviceId) => {
        const response = await fetch(`${API_BASE_URL}/api/service-requests/track/${serviceId}`);
        return response.json();
    },

    // Rental Requests
    createRentalRequest: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/rental-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Admin
    adminLogin: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    adminVerify: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    },

    getStats: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getServiceRequests: async (token, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/api/admin/service-requests?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getRentalRequests: async (token, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/api/admin/rental-requests?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    updateServiceStatus: async (token, id, data) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/service-requests/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    updateRentalStatus: async (token, id, data) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/rental-requests/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    deleteServiceRequest: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/service-requests/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    deleteRentalRequest: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/rental-requests/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },
};

export default api;
