// databit/js/auth.js
import { API } from './api.js';
import { Session } from './session.js';

console.log("🟢 auth.js cargado correctamente v3");

// ==========================================
// 1. LÓGICA DE LOGIN
// ==========================================
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const dni = document.getElementById('login-dni').value;
        const pass = document.getElementById('login-pass').value;

        console.log("Intentando ingresar...", dni);

        try {
            const res = await API.login(dni, pass);
            
            if (res.success) {
                console.log("✅ Login exitoso");
                Session.save(res.token);
                window.location.href = '/public/dashboard.html';
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor");
        }
    });
}

// ==========================================
// 2. LÓGICA DE REGISTRO
// ==========================================
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Detiene la recarga
        console.log("👆 Botón Registrar presionado");

        // Validar contraseñas
        const pass = document.getElementById('reg-pass').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (pass !== confirm) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Armar el objeto de datos
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
            console.log("📡 Enviando registro...", userData);
            const res = await API.register(userData);
            
            if (res.success) {
                alert("¡Cuenta creada con éxito! Ingresa ahora.");
                // Ocultar registro y mostrar login
                document.getElementById('register-box').classList.add('hidden');
                document.getElementById('login-box').classList.remove('hidden');
            } else {
                alert("Error al registrar: " + res.message);
            }
        } catch (error) {
            console.error("❌ Error en registro:", error);
            alert("Error de conexión al intentar registrarse");
        }
    });
}

// ==========================================
// 3. CAMBIO DE VISTAS (LOGIN <-> REGISTRO)
// ==========================================
const btnShowRegister = document.getElementById('btn-show-register');
const btnShowLogin = document.getElementById('btn-show-login');
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');

if (btnShowRegister) {
    btnShowRegister.onclick = () => {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    };
}

if (btnShowLogin) {
    btnShowLogin.onclick = () => {
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    };
}