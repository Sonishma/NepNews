document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sidebar ul li");
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const pages = {
        "Home": "dashboard.html",
        "Manage Authors": "author.html",
        "Manage Editors": "editor.html",
        "Manage Articles": "article.html",
        "Manage Users": "user.html",
        "Manage Ad's Manager": "adm.html",
    };

    // Restore Active Tab
    const activePage = localStorage.getItem("activePage");
    if (activePage) {
        menuItems.forEach(item => {
            if (item.textContent.trim() === activePage) {
                item.classList.add("active");
            }
        });
    }

    // Sidebar Navigation
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

    // Handle Search
    window.handleSidebarSearch = function () {
        const query = document.getElementById("sidebarSearchInput").value.toLowerCase();
        const resultsList = document.getElementById("searchResultsList");
        resultsList.innerHTML = "";

        const allItems = Object.keys(pages);
        const matches = allItems.filter(item => item.toLowerCase().includes(query));

        if (matches.length === 0) {
            resultsList.innerHTML = "<li>No matches found.</li>";
            return;
        }

        matches.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            li.style.cursor = "pointer";
            li.onclick = () => window.location.href = pages[item];
            resultsList.appendChild(li);
        });
    };

    // Bar Chart
    const barChart = new Chart(document.getElementById("barChart"), {
        type: 'bar',
        data: {
            labels: ['Authors', 'Editors', 'Articles', 'Users', 'Ads'],
            datasets: [{
                label: 'Entries Count',
                data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Growth Line Chart
    const growthChart = new Chart(document.getElementById("growthChart"), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Growth Trend',
                data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 1000)),
                fill: false,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true
        }
    });
});
