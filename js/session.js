// databit/js/session.js
export const Session = {
    
    save: (token) => {
        localStorage.setItem('databit_token', token);
    },

    get: () => {
        return localStorage.getItem('databit_token');
    },

    remove: () => {
        localStorage.removeItem('databit_token');
        // CORRECCIÓN: Mandar directo a login.html que está en la misma carpeta
        window.location.href = 'login.html'; 
    },

    check: () => {
        if (!localStorage.getItem('databit_token')) {
            // CORRECCIÓN: Si no hay token, mandar a login.html
            window.location.href = 'login.html';
        }
    }
};