document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Hardcoded credentials
        const validEmail = "sonishma@gmail.com";
        const validPassword = "password123";

        // Get user input
        const emailInput = document.querySelector("input[type='email']").value;
        const passwordInput = document.querySelector("input[type='password']").value;

        // Check credentials
        if (emailInput === validEmail && passwordInput === validPassword) {
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert("Invalid email or password. Please try again.");
        }
    });
});
