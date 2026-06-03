/**
 * SPORTCLUB - LÓGICA DE INTERACCIÓN DEL FRONTEND
 * main.js
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================
    // 1. CONTROL DE DROPDOWN DE PERFIL EN DASHBOARDS
    // ========================================
    const profileBtn = document.getElementById("profile-dropdown-btn");
    const profileMenu = document.getElementById("profile-dropdown-menu");

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("active");
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener("click", (e) => {
            if (!profileMenu.contains(e.target) && e.target !== profileBtn) {
                profileMenu.classList.remove("active");
            }
        });
    }

    // ========================================
    // 2. VALIDACIÓN INTERACTIVA EN REGISTRO DE USUARIO
    // ========================================
    const formRegistro = document.getElementById("form-registro");
    const feedbackRegister = document.getElementById("feedback-register");

    if (formRegistro && feedbackRegister) {
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name-register").value.trim();
            const email = document.getElementById("email-register").value.trim();
            const password = document.getElementById("password-register").value;
            const confirmPassword = document.getElementById("confirm-password-register").value;

            // Limpiar clases previas
            feedbackRegister.className = "feedback-box";
            feedbackRegister.innerHTML = "";

            // 1. Validar campos vacíos
            if ( !name || !email || !password || !confirmPassword) {
                showFeedback(feedbackRegister, "error", "Por favor, completa todos los campos obligatorios.");
                return;
            }

            // 2. Validar formato de correo básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback(feedbackRegister, "error", "Correo inválido. Por favor ingresa un formato de correo correcto.");
                return;
            }

            // 3. Validar largo de contraseña
            if (password.length < 6) {
                showFeedback(feedbackRegister, "error", "La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            // 4. Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                showFeedback(feedbackRegister, "error", "Las contraseñas no coinciden. Inténtalo de nuevo.");
                return;
            }

            // 5. Éxito en el registro
            showFeedback(feedbackRegister, "success", "Usuario registrado correctamente. ¡Bienvenido a SportClub!");
            
            // Simular limpieza del formulario
            formRegistro.reset();

            // Redirigir sutilmente al login tras 2.5 segundos para mejorar la experiencia
            setTimeout(() => {
                window.location.href = "./login.html";
            }, 2500);
        });
    }

    // ========================================
    // 3. RECUPERACIÓN DE CONTRASEÑA INTERACTIVA INLINE
    // ========================================
    const formRecuperar = document.getElementById("form-recuperar");
    const feedbackRecover = document.getElementById("feedback-recover");

    if (formRecuperar && feedbackRecover) {
        formRecuperar.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email-recover").value.trim();

            feedbackRecover.className = "feedback-box";
            feedbackRecover.innerHTML = "";

            if (!email) {
                showFeedback(feedbackRecover, "error", "Por favor, ingresa tu correo electrónico.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback(feedbackRecover, "error", "Correo inválido. Ingresa un formato correcto.");
                return;
            }

            // Éxito: Mostrar mensaje integrado exigido sin usar alert()
            showFeedback(feedbackRecover, "success", "Se ha enviado un enlace de recuperación al correo ingresado.");
            
            // Limpiar formulario
            formRecuperar.reset();
        });
    }

    // Helper para inyectar alertas sutiles con iconos Lucide
    function showFeedback(container, type, message) {
        container.style.display = "flex";
        container.classList.add(type);
        
        let iconName = "info";
        if (type === "success") iconName = "check-circle";
        if (type === "error") iconName = "alert-triangle";

        container.innerHTML = `
            <i data-lucide="${iconName}" style="width: 18px; flex-shrink: 0;"></i>
            <span>${message}</span>
        `;
        
        // Recargar iconos en el contenedor inyectado dinámicamente
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
});
