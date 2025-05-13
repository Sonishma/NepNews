document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const loginBtn = document.getElementById("loginBtn");
  const loginPage = document.getElementById('loginPage');
  const resetPage = document.getElementById('resetPage');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const backToLogin = document.getElementById('backToLogin');
  const header = document.getElementById('header');
  const passwordToggle = document.querySelector('.password-toggle');
  const loginPasswordToggle = document.querySelector('.login-password-toggle');

  // Fake login button click
  loginBtn.addEventListener("click", function () {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
      alert("⚠️ Email and password are required.");
      return;
    }

    // Simulate successful login
    alert("✅ Login Successful!");
    window.location.href = "Admanager_HomePage.html"; // Change this to test redirect
  });

  // Show reset page
  forgotPasswordLink.addEventListener('click', function () {
    loginPage.style.display = 'none';
    resetPage.style.display = 'flex';
    header.style.display = 'block';
  });

  // Show login page again
  backToLogin.addEventListener('click', function () {
    resetPage.style.display = 'none';
    loginPage.style.display = 'flex';
    header.style.display = 'none';
  });

  // Toggle visibility for reset password fields
  passwordToggle.addEventListener('click', function () {
    const confirmPassword = document.getElementById('confirmPassword');
    const newPassword = document.getElementById('newPassword');

    const isPassword = confirmPassword.type === 'password';
    confirmPassword.type = isPassword ? 'text' : 'password';
    newPassword.type = isPassword ? 'text' : 'password';
  });

  // Toggle login password visibility
  loginPasswordToggle.addEventListener('click', function () {
    const loginPassword = document.getElementById('loginPassword');

    const isPassword = loginPassword.type === 'password';
    loginPassword.type = isPassword ? 'text' : 'password';
    this.style.opacity = isPassword ? '0.7' : '1';
  });
});
