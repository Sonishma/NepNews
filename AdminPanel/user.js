document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sidebar ul li");
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");

    // Define pages for each menu item
    const pages = {
        "Home": "dashboard.html",
        "Manage Authors": "author.html",
        "Manage Editors": "editor.html",
        "Manage Articles": "article.html",
        "Manage Users": "user.html",
        "Manage Ad's Manager": "adm.html",
    };

    // Restore active tab on page load
    const activePage = localStorage.getItem("activePage");
    if (activePage) {
        menuItems.forEach(item => {
            if (item.textContent.trim() === activePage) {
                item.classList.add("active");
            }
        });
    }

    // Sidebar Navigation Highlight & Click Event
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            document.querySelector(".sidebar .active")?.classList.remove("active");
            this.classList.add("active");

            const pageName = this.textContent.trim();
            localStorage.setItem("activePage", pageName);

            if (pages[pageName]) {
                window.location.href = pages[pageName];
            }
        });
    });

    // Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("hidden");
        });
    }

    // Add User button functionality
    const addBtn = document.getElementById("addAuthorBtn");
    const authorList = document.getElementById("authorList");

    if (addBtn && authorList) {
        addBtn.addEventListener("click", () => {
            const userName = prompt("Enter new user name:");
            if (userName) {
                const li = document.createElement("li");
                li.innerHTML = `${userName} <button class="remove-btn">Remove</button>`;
                authorList.appendChild(li);
            }
        });
    }

    // Event delegation for Remove buttons
    authorList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            if (confirm("Are you sure you want to remove this user?")) {
                e.target.parentElement.remove();
            }
        }
    });
});
