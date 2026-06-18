/**
 * SPORTCLUB - LÓGICA DE INTERACCIÓN Y CONEXIÓN CON API
 * main.js
 */

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    
    // Ejecutar protección de rutas y redirección al cargar
    checkRouteProtection();

    // Inicializar navegación y pestañas del Dashboard
    initDashboardTabs();

    // Inicializar datos del perfil si estamos en un dashboard
    if (window.location.pathname.includes("dashboard-")) {
        loadUserProfile();
        
        // Si es el dashboard del Administrador, cargar lista de usuarios
        if (window.location.pathname.includes("dashboard-admin.html")) {
            loadAdminUsers();
            initAdminCrudEvents();
        }
    }

    // ========================================
    // 1. CONTROL DE DROPDOWN DE PERFIL EN HEADER
    // ========================================
    const profileBtn = document.getElementById("profile-dropdown-btn");
    const profileMenu = document.getElementById("profile-dropdown-menu");

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!profileMenu.contains(e.target) && e.target !== profileBtn) {
                profileMenu.classList.remove("active");
            }
        });
    }

    // Configurar botón de cerrar sesión
    const logoutLinks = document.querySelectorAll(".dropdown-item.logout");
    logoutLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    });

    // ========================================
    // 2. INICIO DE SESIÓN (LOGIN)
    // ========================================
    const formLogin = document.getElementById("form-login");
    const feedbackLogin = document.getElementById("feedback-login");

    if (formLogin && feedbackLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearValidationErrors(formLogin);
            feedbackLogin.style.display = "none";

            const email = document.getElementById("email-login").value.trim();
            const password = document.getElementById("password-login").value;

            let hasErrors = false;
            if (!email) {
                showFieldError(document.getElementById("email-login"), "El correo electrónico es obligatorio");
                hasErrors = true;
            } else if (!validateEmail(email)) {
                showFieldError(document.getElementById("email-login"), "Formato de correo electrónico inválido");
                hasErrors = true;
            }

            if (!password) {
                showFieldError(document.getElementById("password-login"), "La contraseña es obligatoria");
                hasErrors = true;
            }

            if (hasErrors) return;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const resJson = await response.json();
                    
                    // Manejar empaquetado del Backend ({ data: { token, user } }) o directo
                    const data = resJson.data || resJson;
                    const token = data.token;
                    const user = data.user;

                    if (token && user) {
                        localStorage.setItem("token", token);
                        localStorage.setItem("user", JSON.stringify(user));
                        
                        showFeedback(feedbackLogin, "success", "Inicio de sesión correcto. Redirigiendo...");
                        
                        setTimeout(() => {
                            redirectByRole(user.role);
                        }, 1000);
                    } else {
                        showFeedback(feedbackLogin, "error", "Respuesta inesperada del servidor.");
                    }
                } else {
                    const err = await response.json().catch(() => ({}));
                    showFeedback(feedbackLogin, "error", err.message || "Credenciales incorrectas. Inténtalo de nuevo.");
                }
            } catch (error) {
                console.error("Login Error:", error);
                showFeedback(feedbackLogin, "error", "Error de conexión con el servidor.");
            }
        });
    }

    // ========================================
    // 3. REGISTRO DE USUARIOS
    // ========================================
    const formRegistro = document.getElementById("form-registro");
    const feedbackRegister = document.getElementById("feedback-register");

    if (formRegistro && feedbackRegister) {
        formRegistro.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearValidationErrors(formRegistro);
            feedbackRegister.style.display = "none";

            const name = document.getElementById("name-register").value.trim();
            const email = document.getElementById("email-register").value.trim();
            const password = document.getElementById("password-register").value;
            const confirmPassword = document.getElementById("confirm-password-register").value;
            const sport = document.getElementById("sport-register").value;

            let hasErrors = false;
            if (!name) {
                showFieldError(document.getElementById("name-register"), "El nombre completo es obligatorio");
                hasErrors = true;
            }

            if (!email) {
                showFieldError(document.getElementById("email-register"), "El correo electrónico es obligatorio");
                hasErrors = true;
            } else if (!validateEmail(email)) {
                showFieldError(document.getElementById("email-register"), "Correo electrónico inválido");
                hasErrors = true;
            }

            if (!password) {
                showFieldError(document.getElementById("password-register"), "La contraseña es obligatoria");
                hasErrors = true;
            } else if (password.length < 8) {
                showFieldError(document.getElementById("password-register"), "La contraseña debe tener al menos 8 caracteres");
                hasErrors = true;
            }

            if (!confirmPassword) {
                showFieldError(document.getElementById("confirm-password-register"), "Confirma tu contraseña");
                hasErrors = true;
            } else if (password !== confirmPassword) {
                showFieldError(document.getElementById("confirm-password-register"), "Las contraseñas no coinciden");
                hasErrors = true;
            }

            if (hasErrors) return;

            // Mapear campos requeridos por el backend (full_name, birth_date, metadata, otros)
            const payload = {
                full_name: name,
                name: name, // Enviar ambos por compatibilidad
                email,
                password,
                password_confirmation: confirmPassword,
                birth_date: "2000-01-10", // Valor por defecto seguro para inicializar
                fecha_nacimiento: "2000-01-10",
                metadata: {
                    sports: sport ? [{ name: sport, frequency_per_week: 3 }] : []
                },
                otros: {
                    practica_deporte: !!sport,
                    deporte: sport || ""
                }
            };

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    showFeedback(feedbackRegister, "success", "¡Registro exitoso! Redirigiendo al Login...");
                    formRegistro.reset();
                    setTimeout(() => {
                        window.location.href = "./login.html";
                    }, 2000);
                } else {
                    const err = await response.json().catch(() => ({}));
                    showFeedback(feedbackRegister, "error", err.message || "Error al registrar usuario.");
                }
            } catch (error) {
                console.error("Register Error:", error);
                showFeedback(feedbackRegister, "error", "Error de conexión con el servidor.");
            }
        });
    }

    // ========================================
    // 4. RECUPERACIÓN DE CONTRASEÑA (MOCK)
    // ========================================
    const formRecuperar = document.getElementById("form-recuperar");
    const feedbackRecover = document.getElementById("feedback-recover");

    if (formRecuperar && feedbackRecover) {
        formRecuperar.addEventListener("submit", (e) => {
            e.preventDefault();
            clearValidationErrors(formRecuperar);
            feedbackRecover.style.display = "none";

            const email = document.getElementById("email-recover").value.trim();

            if (!email) {
                showFieldError(document.getElementById("email-recover"), "El correo electrónico es obligatorio");
                return;
            } else if (!validateEmail(email)) {
                showFieldError(document.getElementById("email-recover"), "Correo electrónico inválido");
                return;
            }

            showFeedback(feedbackRecover, "success", "Se ha enviado un enlace de recuperación al correo ingresado.");
            formRecuperar.reset();
        });
    }

    // ========================================
    // 5. EDICIÓN DE PERFIL DEL USUARIO LOGUEADO
    // ========================================
    const formEditProfile = document.getElementById("form-edit-profile");
    const feedbackProfile = document.getElementById("feedback-profile");
    
    // Toggle de Vista / Edición de Perfil
    const btnToggleEdit = document.getElementById("btn-toggle-edit-profile");
    const btnCancelEdit = document.getElementById("btn-cancel-edit-profile");
    const profileViewCard = document.getElementById("profile-view-card");
    const profileEditCard = document.getElementById("profile-edit-card");

    if (btnToggleEdit && profileViewCard && profileEditCard) {
        btnToggleEdit.addEventListener("click", () => {
            profileViewCard.classList.add("hidden");
            profileEditCard.classList.remove("hidden");
        });
    }

    if (btnCancelEdit && profileViewCard && profileEditCard) {
        btnCancelEdit.addEventListener("click", () => {
            clearValidationErrors(formEditProfile);
            if (feedbackProfile) feedbackProfile.style.display = "none";
            profileEditCard.classList.add("hidden");
            profileViewCard.classList.remove("hidden");
        });
    }

    if (formEditProfile && feedbackProfile) {
        formEditProfile.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearValidationErrors(formEditProfile);
            feedbackProfile.style.display = "none";

            const name = document.getElementById("profile-name").value.trim();
            const email = document.getElementById("profile-email").value.trim();
            const birthdate = document.getElementById("profile-birthdate").value;
            const sport = document.getElementById("profile-sport").value;
            const metadataOtherInput = document.getElementById("profile-metadata-other");
            const metadataOther = metadataOtherInput ? metadataOtherInput.value.trim() : "";

            let hasErrors = false;
            if (!name) {
                showFieldError(document.getElementById("profile-name"), "El nombre es obligatorio");
                hasErrors = true;
            }
            if (!email) {
                showFieldError(document.getElementById("profile-email"), "El email es obligatorio");
                hasErrors = true;
            } else if (!validateEmail(email)) {
                showFieldError(document.getElementById("profile-email"), "Email inválido");
                hasErrors = true;
            }

            if (hasErrors) return;

            // Formatear payload con compatibilidad cruzada de nombres de campos
            const payload = {
                full_name: name,
                name: name,
                email: email,
                birth_date: birthdate,
                fecha_nacimiento: birthdate,
                metadata: {
                    sports: sport ? [{ name: sport, frequency_per_week: 3 }] : [],
                    info_adicional: metadataOther
                },
                otros: {
                    practica_deporte: !!sport,
                    deporte: sport || "",
                    info_adicional: metadataOther
                }
            };

            try {
                const response = await apiFetch("/auth/me", {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });

                if (response && response.ok) {
                    const resJson = await response.json();
                    const updatedUser = resJson.data?.user || resJson.data || resJson.user || resJson;
                    
                    // Actualizar localStorage
                    localStorage.setItem("user", JSON.stringify(updatedUser));

                    showFeedback(feedbackProfile, "success", "Perfil actualizado correctamente.");
                    await loadUserProfile();
                    
                    setTimeout(() => {
                        feedbackProfile.style.display = "none";
                        // Regresar al modo vista
                        if (profileViewCard && profileEditCard) {
                            profileViewCard.classList.remove("hidden");
                            profileEditCard.classList.add("hidden");
                        }
                    }, 2000);
                } else {
                    const err = await response.json().catch(() => ({}));
                    showFeedback(feedbackProfile, "error", err.message || "Error al actualizar perfil.");
                }
            } catch (error) {
                console.error("Profile Update Error:", error);
                showFeedback(feedbackProfile, "error", "Error de conexión con el servidor.");
            }
        });
    }

    // ========================================
    // 6. CAMBIO DE CONTRASEÑA
    // ========================================
    const formChangePassword = document.getElementById("form-change-password");
    const feedbackPassword = document.getElementById("feedback-password");

    if (formChangePassword && feedbackPassword) {
        formChangePassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearValidationErrors(formChangePassword);
            feedbackPassword.style.display = "none";

            const currentPassword = document.getElementById("password-current").value;
            const newPassword = document.getElementById("password-new").value;
            const confirmPassword = document.getElementById("password-confirm").value;

            let hasErrors = false;
            if (!currentPassword) {
                showFieldError(document.getElementById("password-current"), "La contraseña actual es obligatoria");
                hasErrors = true;
            }

            if (!newPassword) {
                showFieldError(document.getElementById("password-new"), "La nueva contraseña es obligatoria");
                hasErrors = true;
            } else if (newPassword.length < 8) {
                showFieldError(document.getElementById("password-new"), "La nueva contraseña debe tener al menos 8 caracteres");
                hasErrors = true;
            }

            if (!confirmPassword) {
                showFieldError(document.getElementById("password-confirm"), "Confirma tu nueva contraseña");
                hasErrors = true;
            } else if (newPassword !== confirmPassword) {
                showFieldError(document.getElementById("password-confirm"), "Las contraseñas no coinciden");
                hasErrors = true;
            }

            if (hasErrors) return;

            try {
                const response = await apiFetch("/auth/me/password", {
                    method: "PUT",
                    body: JSON.stringify({ currentPassword, newPassword })
                });

                if (response && response.ok) {
                    showFeedback(feedbackPassword, "success", "Perfil actualizado correctamente.");
                    formChangePassword.reset();
                    setTimeout(() => {
                        feedbackPassword.style.display = "none";
                    }, 3000);
                } else {
                    const err = await response.json().catch(() => ({}));
                    showFeedback(feedbackPassword, "error", err.message || "Error al cambiar contraseña.");
                }
            } catch (error) {
                console.error("Password Change Error:", error);
                showFeedback(feedbackPassword, "error", "Error de conexión con el servidor.");
            }
        });
    }
});

// ========================================
// HELPER: CLIENTE API CENTRALIZADO
// ========================================
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            logout();
            return null;
        }

        return response;
    } catch (e) {
        console.error("API Fetch Error:", e);
        throw e;
    }
}

// ========================================
// HELPER: VALIDACIÓN Y FEEDBACK VISUAL
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function clearValidationErrors(form) {
    const inputs = form.querySelectorAll(".form-input");
    inputs.forEach(input => {
        input.classList.remove("is-invalid");
    });
    const errorSpans = form.querySelectorAll(".error-message");
    errorSpans.forEach(span => {
        span.textContent = "";
    });
}

function showFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add("is-invalid");
    
    const parent = inputEl.closest(".form-group");
    if (parent) {
        const span = parent.querySelector(".error-message");
        if (span) {
            span.textContent = message;
        }
    }
}

function showFeedback(container, type, message) {
    if (!container) return;
    container.style.display = "flex";
    container.className = `feedback-box ${type}`;
    
    let iconName = "info";
    if (type === "success") iconName = "check-circle";
    if (type === "error") iconName = "alert-triangle";

    container.innerHTML = `
        <i data-lucide="${iconName}" style="width: 18px; flex-shrink: 0;"></i>
        <span>${message}</span>
    `;
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function formatDate(dateString) {
    if (!dateString) return "No especificada";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateString;
    }
}

function capitalize(str) {
    if (!str) return "";
    return str.split(" ")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ");
}

// ========================================
// LÓGICA: PROTECCIÓN Y REDIRECCIÓN DE RUTAS
// ========================================
function checkRouteProtection() {
    const path = window.location.pathname;
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const isDashboard = path.includes("dashboard-");

    if (isDashboard) {
        if (!token || !userJson) {
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(userJson);
        const role = user.role;

        // Comprobación cruzada
        if (path.includes("dashboard-admin.html") && role !== "admin") {
            redirectByRole(role);
        } else if (path.includes("dashboard-coach.html") && role !== "coach") {
            redirectByRole(role);
        } else if (path.includes("dashboard-usuario.html") && role !== "user") {
            redirectByRole(role);
        }
    } else if (path.includes("login.html") || path.includes("registro.html")) {
        if (token && userJson) {
            const user = JSON.parse(userJson);
            redirectByRole(user.role);
        }
    }
}

function redirectByRole(role) {
    if (role === "admin") {
        window.location.href = "dashboard-admin.html";
    } else if (role === "coach") {
        window.location.href = "dashboard-coach.html";
    } else {
        window.location.href = "dashboard-usuario.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ========================================
// LÓGICA: CARGA DINÁMICA DE PERFIL DE USUARIO
// ========================================
async function loadUserProfile() {
    try {
        const response = await apiFetch("/auth/me");
        if (!response || !response.ok) return;
        const resJson = await response.json();
        
        // Mapear compatibilidad cruzada de envolturas
        const user = resJson.data?.user || resJson.data || resJson.user || resJson;

        // Extraer campos con compatibilidad
        const rawName = user.full_name || user.name || "";
        const rawEmail = user.email || "";
        const rawRole = user.role || "";
        const rawBirth = user.birth_date || user.fecha_nacimiento || "";
        const rawSport = user.otros?.deporte || user.metadata?.sports?.[0]?.name || user.sport || "";
        const rawInfoAdicional = user.otros?.info_adicional || user.metadata?.info_adicional || "";

        // 1. Elementos del Dashboard Principal / Perfil Rápido
        const quickInitials = document.getElementById("quick-profile-initials");
        if (quickInitials && rawName) {
            quickInitials.textContent = rawName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
        }
        const quickName = document.getElementById("quick-profile-name");
        if (quickName) quickName.textContent = capitalize(rawName);
        const quickEmail = document.getElementById("quick-profile-email");
        if (quickEmail) quickEmail.textContent = rawEmail.toLowerCase();
        const quickBirth = document.getElementById("quick-profile-birthdate");
        if (quickBirth) quickBirth.textContent = formatDate(rawBirth);
        const quickSport = document.getElementById("quick-profile-sport");
        if (quickSport) quickSport.textContent = capitalize(rawSport) || "No seleccionado";

        // 2. Elementos de la Tarjeta Visual Principal (Vista de Perfil)
        const mainProfileName = document.getElementById("main-profile-name");
        if (mainProfileName) mainProfileName.textContent = capitalize(rawName);
        const mainProfileEmail = document.getElementById("main-profile-email");
        if (mainProfileEmail) mainProfileEmail.textContent = rawEmail.toLowerCase();
        
        const mainProfileRoleBadge = document.getElementById("main-profile-role-badge");
        if (mainProfileRoleBadge && rawRole) {
            mainProfileRoleBadge.textContent = rawRole.toLowerCase();
            mainProfileRoleBadge.className = `badge role-${rawRole.toLowerCase()}`;
        }
        
        const mainProfileBirthdate = document.getElementById("main-profile-birthdate");
        if (mainProfileBirthdate) mainProfileBirthdate.textContent = formatDate(rawBirth);
        
        const mainProfileSport = document.getElementById("main-profile-sport");
        if (mainProfileSport) mainProfileSport.textContent = capitalize(rawSport) || "Ninguno";
        
        const mainProfileMetadataOther = document.getElementById("main-profile-metadata-other");
        if (mainProfileMetadataOther) mainProfileMetadataOther.textContent = rawInfoAdicional || "Ninguno";

        // Foto de Perfil (placeholder si no existe)
        const mainProfileAvatarImg = document.getElementById("main-profile-avatar-img");
        const mainProfileAvatarPlaceholder = document.getElementById("main-profile-avatar-placeholder");
        const userPhoto = user.photo || user.avatar || user.metadata?.photo || "";
        if (userPhoto) {
            if (mainProfileAvatarImg) {
                mainProfileAvatarImg.src = userPhoto;
                mainProfileAvatarImg.classList.remove("hidden");
            }
            if (mainProfileAvatarPlaceholder) mainProfileAvatarPlaceholder.classList.add("hidden");
        } else {
            if (mainProfileAvatarImg) mainProfileAvatarImg.classList.add("hidden");
            if (mainProfileAvatarPlaceholder) {
                mainProfileAvatarPlaceholder.classList.remove("hidden");
                mainProfileAvatarPlaceholder.textContent = rawName ? rawName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
            }
        }

        // 3. Elementos del Formulario de Edición
        const profileNameInput = document.getElementById("profile-name");
        if (profileNameInput) profileNameInput.value = rawName;
        const profileEmailInput = document.getElementById("profile-email");
        if (profileEmailInput) profileEmailInput.value = rawEmail.toLowerCase();
        const profileRoleDisplay = document.getElementById("profile-role-display");
        if (profileRoleDisplay) profileRoleDisplay.value = rawRole ? rawRole.toUpperCase() : "";
        const profileBirthInput = document.getElementById("profile-birthdate");
        if (profileBirthInput && rawBirth) {
            const dateObj = new Date(rawBirth);
            if (!isNaN(dateObj.getTime())) {
                profileBirthInput.value = dateObj.toISOString().split("T")[0];
            }
        }
        const profileSportSelect = document.getElementById("profile-sport");
        if (profileSportSelect) profileSportSelect.value = rawSport || "";

        const profileMetadataOtherInput = document.getElementById("profile-metadata-other");
        if (profileMetadataOtherInput) profileMetadataOtherInput.value = rawInfoAdicional;

        // 4. Encabezados y Nombres en el Dropdown
        const dropdownName = document.querySelector(".dropdown-name");
        if (dropdownName) dropdownName.textContent = capitalize(rawName);
        const dropdownEmail = document.querySelector(".dropdown-email");
        if (dropdownEmail) dropdownEmail.textContent = rawEmail.toLowerCase();

        // 5. Mensaje de Bienvenida Dinámico
        const welcomeMessage = document.getElementById("welcome-message");
        if (welcomeMessage) {
            const firstName = rawName ? rawName.split(" ")[0] : "Usuario";
            if (rawRole === "admin") {
                welcomeMessage.textContent = `¡Bienvenido, Administrador ${capitalize(firstName)}!`;
            } else if (rawRole === "coach") {
                welcomeMessage.textContent = `¡Bienvenido, Coach ${capitalize(firstName)}!`;
            } else {
                welcomeMessage.textContent = `¡Bienvenido, ${capitalize(firstName)}!`;
            }
        }

    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }
}

// ========================================
// LÓGICA: NAVEGACIÓN DE PESTAÑAS (SPA)
// ========================================
function initDashboardTabs() {
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    if (sidebarLinks.length === 0) return;

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href.startsWith("#")) return; // Seguir links normales

            e.preventDefault();

            sidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const targetId = href.substring(1);
            const sections = document.querySelectorAll(".db-section");

            sections.forEach(sec => {
                if (sec.id === targetId || (targetId === "inicio" && sec.id === "inicio-seccion")) {
                    sec.classList.remove("hidden");
                } else {
                    sec.classList.add("hidden");
                }
            });
        });
    });

    const dropdownLinkProfile = document.getElementById("dropdown-link-profile");
    if (dropdownLinkProfile) {
        dropdownLinkProfile.addEventListener("click", (e) => {
            e.preventDefault();
            
            const profileMenu = document.getElementById("profile-dropdown-menu");
            if (profileMenu) profileMenu.classList.remove("active");

            const profileSidebarLink = Array.from(sidebarLinks).find(l => l.getAttribute("href") === "#perfil-detallado-seccion");
            if (profileSidebarLink) {
                profileSidebarLink.click();
            } else {
                const sections = document.querySelectorAll(".db-section");
                sections.forEach(sec => {
                    if (sec.id === "perfil-detallado-seccion") {
                        sec.classList.remove("hidden");
                    } else {
                        sec.classList.add("hidden");
                    }
                });
            }
        });
    }
}

// ========================================
// LÓGICA: CRUD DE USUARIOS (ADMINISTRADOR)
// ========================================
async function loadAdminUsers() {
    const tableBody = document.getElementById("admin-users-table");
    if (!tableBody) return;

    try {
        const response = await apiFetch("/users");
        if (!response || !response.ok) return;

        const resJson = await response.json();
        
        // Mapear compatibilidad de envolturas de arrays
        const users = resJson.data || resJson;

        if (!Array.isArray(users)) {
            console.error("Expected array of users, got:", users);
            return;
        }

        // Actualizar estadísticas
        const totalUsersEl = document.getElementById("stats-total-users");
        if (totalUsersEl) totalUsersEl.textContent = users.length;

        const totalCoachesEl = document.getElementById("stats-total-coaches");
        if (totalCoachesEl) {
            const coaches = users.filter(u => u.role === "coach");
            totalCoachesEl.textContent = coaches.length;
        }

        tableBody.innerHTML = "";

        users.forEach(user => {
            const tr = document.createElement("tr");

            let roleClass = "role-user";
            if (user.role === "admin") roleClass = "role-admin";
            if (user.role === "coach") roleClass = "role-coach";

            const rawName = user.full_name || user.name || "";
            const nameCap = capitalize(rawName);
            const emailLower = (user.email || "").toLowerCase();
            const dateFormatted = formatDate(user.createdAt || user.created_at || user.fecha_nacimiento);

            tr.innerHTML = `
                <td>${user.id}</td>
                <td><strong>${nameCap}</strong></td>
                <td>${emailLower}</td>
                <td><span class="badge ${roleClass}">${user.role}</span></td>
                <td>${dateFormatted}</td>
                <td>
                    <button class="btn-action-edit" data-id="${user.id}">
                        <i data-lucide="pencil" style="width: 13px;"></i> Editar
                    </button>
                    <button class="btn-action-delete" data-id="${user.id}">
                        <i data-lucide="trash-2" style="width: 13px;"></i> Eliminar
                    </button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        tableBody.querySelectorAll(".btn-action-edit").forEach(btn => {
            btn.addEventListener("click", () => openEditUserModal(btn.dataset.id));
        });

        tableBody.querySelectorAll(".btn-action-delete").forEach(btn => {
            btn.addEventListener("click", () => deleteUser(btn.dataset.id));
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }

    } catch (error) {
        console.error("Error al listar usuarios:", error);
    }
}

function initAdminCrudEvents() {
    const btnCreateTrigger = document.getElementById("btn-create-user-trigger");
    const btnCreateTriggerTable = document.getElementById("btn-create-user-table-trigger");
    const btnCloseModal = document.getElementById("close-modal-btn");
    const modal = document.getElementById("user-modal");
    const userForm = document.getElementById("user-form");

    if (btnCreateTrigger) {
        btnCreateTrigger.addEventListener("click", openCreateUserModal);
    }
    if (btnCreateTriggerTable) {
        btnCreateTriggerTable.addEventListener("click", openCreateUserModal);
    }

    if (btnCloseModal && modal) {
        btnCloseModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
        
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    if (userForm) {
        userForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearValidationErrors(userForm);

            const feedbackModal = document.getElementById("feedback-modal");
            feedbackModal.style.display = "none";

            const userId = document.getElementById("user-id").value;
            const name = document.getElementById("user-name").value.trim();
            const email = document.getElementById("user-email").value.trim();
            const role = document.getElementById("user-role").value;

            let hasErrors = false;

            if (!name) {
                showFieldError(document.getElementById("user-name"), "El nombre es obligatorio");
                hasErrors = true;
            }

            if (!email) {
                showFieldError(document.getElementById("user-email"), "El correo electrónico es obligatorio");
                hasErrors = true;
            } else if (!validateEmail(email)) {
                showFieldError(document.getElementById("user-email"), "Correo electrónico inválido");
                hasErrors = true;
            }

            if (!role) {
                showFieldError(document.getElementById("user-role"), "Selecciona un rol");
                hasErrors = true;
            }

            let password = "";
            let confirmPassword = "";

            if (!userId) {
                password = document.getElementById("user-password").value;
                confirmPassword = document.getElementById("user-confirm-password").value;

                if (!password) {
                    showFieldError(document.getElementById("user-password"), "La contraseña es obligatoria");
                    hasErrors = true;
                } else if (password.length < 8) {
                    showFieldError(document.getElementById("user-password"), "Debe tener mínimo 8 caracteres");
                    hasErrors = true;
                }

                if (!confirmPassword) {
                    showFieldError(document.getElementById("user-confirm-password"), "Confirma la contraseña");
                    hasErrors = true;
                } else if (password !== confirmPassword) {
                    showFieldError(document.getElementById("user-confirm-password"), "Las contraseñas no coinciden");
                    hasErrors = true;
                }
            }

            if (hasErrors) return;

            const method = userId ? "PUT" : "POST";
            const endpoint = userId ? `/users/${userId}` : "/users";
            
            // Adaptar campos al esquema del backend
            const body = {
                full_name: name,
                name: name,
                email,
                role,
                birth_date: "2000-01-10",
                fecha_nacimiento: "2000-01-10"
            };

            if (!userId) {
                body.password = password;
                body.password_confirmation = confirmPassword;
            }

            try {
                const response = await apiFetch(endpoint, {
                    method,
                    body: JSON.stringify(body)
                });

                if (response && response.ok) {
                    showFeedback(feedbackModal, "success", userId ? "Usuario actualizado correctamente." : "Usuario creado correctamente.");
                    userForm.reset();
                    
                    setTimeout(() => {
                        modal.style.display = "none";
                        loadAdminUsers();
                    }, 1200);
                } else {
                    const err = await response.json().catch(() => ({}));
                    showFeedback(feedbackModal, "error", err.message || "Error al guardar usuario.");
                }
            } catch (error) {
                console.error("CRUD Save Error:", error);
                showFeedback(feedbackModal, "error", "Error al conectar con el servidor.");
            }
        });
    }
}

function openCreateUserModal() {
    const modal = document.getElementById("user-modal");
    const userForm = document.getElementById("user-form");
    if (!modal || !userForm) return;

    clearValidationErrors(userForm);
    userForm.reset();

    document.getElementById("modal-title").textContent = "Nuevo Usuario";
    document.getElementById("user-id").value = "";
    document.getElementById("modal-password-fields").style.display = "block";
    document.getElementById("feedback-modal").style.display = "none";

    modal.style.display = "flex";
}

async function openEditUserModal(userId) {
    const modal = document.getElementById("user-modal");
    const userForm = document.getElementById("user-form");
    if (!modal || !userForm) return;

    clearValidationErrors(userForm);
    document.getElementById("feedback-modal").style.display = "none";

    try {
        const response = await apiFetch(`/users/${userId}`);
        if (!response || !response.ok) return;

        const resJson = await response.json();
        
        // Mapear compatibilidad de envolturas
        const user = resJson.data || resJson;

        document.getElementById("modal-title").textContent = "Editar Usuario";
        document.getElementById("user-id").value = user.id;
        document.getElementById("user-name").value = user.full_name || user.name || "";
        document.getElementById("user-email").value = user.email || "";
        document.getElementById("user-role").value = user.role || "";
        
        document.getElementById("modal-password-fields").style.display = "none";

        modal.style.display = "flex";

    } catch (error) {
        console.error("Error al cargar detalle del usuario:", error);
    }
}

async function deleteUser(userId) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este usuario del sistema?");
    if (!confirmDelete) return;

    try {
        const response = await apiFetch(`/users/${userId}`, {
            method: "DELETE"
        });

        if (response && response.ok) {
            loadAdminUsers();
        } else {
            console.error("Error al eliminar");
        }
    } catch (error) {
        console.error("Error en petición de eliminación:", error);
    }
}
