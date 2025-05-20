document.addEventListener("DOMContentLoaded", () => {
  const activeTab = document.querySelector(".tab.active").textContent.trim().toLowerCase();
  let role = activeTab.includes("author") ? "author" : activeTab.includes("editor") ? "editor" : "ad_manager";

  fetch(`http://localhost:5000/api/users/${role}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(users => {
      window.allUsers = users; // Store all users for searching
      displayUsers(users);
    })
    .catch(error => console.error("Error fetching users", error));
});

function displayUsers(users) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = users.map(user => 
    `<tr><td>${user.name}</td><td>${user.email}</td>
    <td><button onclick="removeUser('${user._id}')">Remove</button></td></tr>`
  ).join("");
}

// Search functionality (by name or email)
function handleSidebarSearch() {
  const query = document.getElementById("sidebarSearchInput").value.trim().toLowerCase();
  const filteredUsers = window.allUsers.filter(user => 
    user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
  );
  displayUsers(filteredUsers);
}

function submitUser() {
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  
  if (!name || !email) {
    alert("Please fill in all fields!");
    return;
  }

  const activeTab = document.querySelector(".tab.active").textContent.trim().toLowerCase();
  let role = activeTab.includes("author") ? "author" : activeTab.includes("editor") ? "editor" : "ad_manager";

  fetch("http://localhost:5000/api/addUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role })
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    alert(`User added!\nName: ${data.user.name}\nEmail: ${data.user.email}\nPassword: ${data.user.password}`);
    location.reload();  // Refresh table to show the new user
  })
  .catch(error => console.error("Error adding user", error));
}

function removeUser(userId) {
  fetch(`http://localhost:5000/api/removeUser/${userId}`, {
    method: "DELETE"
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then(() => location.reload()) // Refresh after removal
  .catch(error => console.error("Error removing user", error));
}
