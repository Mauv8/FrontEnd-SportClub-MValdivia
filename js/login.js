 // Usuarios predeterminados
 const usuarios = [
    { user: "user1@sportclub.cl", name: "User 1", password: "1234", role: "user" },
    { user: "admin1@sportclub.cl", name: "Admin 1", password: "1234", role: "admin" },
    { user: "coach1@sportclub.cl", name: "coach 1", password: "1234", role: "coach" },
    { user: "user2@sportclub.cl", name: "user 2", password: "1234", role: "user" },
    { user: "admin2@sportclub.cl", name: "Admin 2", password: "1234", role: "admin" },
    { user: "coach2@sportclub.cl", name: "coach 2", password: "1234", role: "coach" }
  ];



document.getElementById("loginFrom").addEventListener("submits", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
     // Guardar el usuario logueado en localStorage
    localStorage.setItem("user", JSON.stringify(user));})

document.getElementById("loginFrom").addEventListener("submits", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
     // Guardar el admin logueado en localStorage
    localStorage.setItem("admin", JSON.stringify(admin));})

document.getElementById("loginFrom").addEventListener("submits", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
     // Guardar el coach logueado en localStorage
    localStorage.setItem("coach", JSON.stringify(coach));})



