import { API } from './api.js';
import { Session } from './session.js';

console.log("💎 Auth UI Profesional Cargado");

// --- FUNCIONES DE EFECTOS VISUALES ---
const loadingState = (btnId, isLoading, textDefault) => {
    const btn = document.getElementById(btnId);
    const span = btn.querySelector('span'); // El texto dentro del botón
    
    if (isLoading) {
        btn.disabled = true; // Bloquear click
        span.textContent = "Procesando..."; // Cambiar texto
        btn.style.opacity = "0.7";
    } else {
        btn.disabled = false; // Desbloquear click
        span.textContent = textDefault; // Restaurar texto
        btn.style.opacity = "1";
    }
};

// =======================
// 1. LÓGICA DE LOGIN
// =======================
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dni = document.getElementById('login-dni').value;
        const pass = document.getElementById('login-pass').value;

        // EFECTO: Activamos modo carga
        loadingState('btn-login', true, 'Ingresar');

        try {
            const res = await API.login(dni, pass);
            
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Accediendo al panel...',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    Session.save(res.token);
                    window.location.href = '/public/dashboard.html';
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: res.message
                });
                loadingState('btn-login', false, 'Ingresar');
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No hay conexión con el servidor' });
            loadingState('btn-login', false, 'Ingresar');
        }
    });
}

// =======================
// 2. LÓGICA DE REGISTRO
// =======================
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pass = document.getElementById('reg-pass').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (pass !== confirm) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'warning');
            return;
        }

        // EFECTO: Activamos modo carga en registro
        loadingState('btn-register', true, 'Registrarse');

        const userData = {
            nombre: document.getElementById('reg-nombre').value,
            apellido: document.getElementById('reg-apellido').value,
            dni: document.getElementById('reg-dni').value,
            telefono: document.getElementById('reg-tel').value,
            correo: document.getElementById('reg-email').value,
            direccion: document.getElementById('reg-dir').value,
            password: pass
        };

        try {
            const res = await API.register(userData);
            
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cuenta Creada',
                    text: 'Ya puedes iniciar sesión con tus datos.',
                    confirmButtonText: 'Ir al Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'login.html';
                    }
                });
            } else {
                Swal.fire('Error', res.message, 'error');
                loadingState('btn-register', false, 'Registrarse');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Fallo al intentar registrarse', 'error');
            loadingState('btn-register', false, 'Registrarse');
        }
    });
}