document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sidebar ul li");
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle"); // Sidebar toggle icon/button

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

            // Save active tab in localStorage
            const pageName = this.textContent.trim();
            localStorage.setItem("activePage", pageName);

            // Navigate to the corresponding page
            if (pages[pageName]) {
                window.location.href = pages[pageName];
            }
        });
    });


    // ✅ Make openArticle & closeArticle Global
    window.openArticle = function (title, content, status) {
        document.getElementById("article-title").innerText = title;
        document.getElementById("article-content").innerText = content;
        
        
        document.getElementById("article-modal").style.display = "flex";
    };

    window.closeArticle = function () {
        document.getElementById("article-modal").style.display = "none";
    };


    // Function to remove
    window.removeArticle = function (event, button) {
        event.stopPropagation(); // Prevent triggering openArticle
        const article = button.closest(".article");
        if (confirm("Are you sure you want to remove this article?")) {
            article.remove();
        }
    };

    // Sidebar Toggle Functionality
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("hidden");
        });
    }
});
