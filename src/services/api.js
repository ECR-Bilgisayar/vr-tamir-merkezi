const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
    // Service Requests - ✅ DÜZELTİLDİ: /api/ kaldırıldı
    createServiceRequest: async (data) => {
        const response = await fetch(`${API_BASE_URL}/service-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    trackServiceRequest: async (serviceId) => {
        const response = await fetch(`${API_BASE_URL}/service-requests/track/${serviceId}`);
        return response.json();
    },

    // Rental Requests - ✅ DÜZELTİLDİ
    createRentalRequest: async (data) => {
        const response = await fetch(`${API_BASE_URL}/rental-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Admin - ✅ DÜZELTİLDİ
    adminLogin: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    adminVerify: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/verify`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    },

    getStats: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getServiceRequests: async (token, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/admin/service-requests?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getRentalRequests: async (token, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/admin/rental-requests?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    updateServiceStatus: async (token, id, data) => {
        const response = await fetch(`${API_BASE_URL}/admin/service-requests/${id}/status`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/rental-requests/${id}/status`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/service-requests/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    deleteRentalRequest: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/admin/rental-requests/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },
};

export default api;