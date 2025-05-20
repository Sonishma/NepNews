document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("loginPassword").value;
    const role = document.getElementById("role").value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

   fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: document.getElementById("emailInput").value.trim(),
        password: document.getElementById("loginPassword").value,
        role: document.getElementById("role").value
    })
})


    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", role);

            switch (role) {
                case "author": window.location.href = "author-panel1/home/homepage.html"; break;
                case "editor": window.location.href = "/NepNews_EditorPanel/Editor_Homepage.html"; break;
                case "admin": window.location.href = "admin-panel/homepage.html"; break;
                case "ads_manager": window.location.href = "/NepNews_AdmanagerPanel/Admanager_Homepage.html"; break;
                default: window.location.href = "dashboard.html";
            }
        } else {
            alert("Invalid login credentials.");
        }
    })
    .catch(error => console.error("Login error:", error));
});
