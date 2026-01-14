// databit/js/api.js
const API_URL = 'http://127.0.0.1:5000/api';

export const API = {
    async login(dni, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni, password })
        });
        return await response.json();
    },

    // --- NUEVA FUNCIÓN ---
    async register(userData) {
        console.log("Enviando datos de registro...", userData);
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    }
};