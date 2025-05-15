document.addEventListener("DOMContentLoaded", function () {
    const pendingSection = document.querySelector(".section:nth-of-type(1)");
    const reviewedSection = document.querySelector(".section:nth-of-type(2)");
    const userIcon = document.querySelector(".user-icon");
  const modal = document.getElementById("profileModal");
  const logoutBtn = document.getElementById("logoutBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const emailDisplay = document.getElementById("editorEmailDisplay");

    if (!pendingSection || !reviewedSection) {
        console.error("❌ Error: Article sections missing in DOM.");
        return;
    }

    async function loadArticles() {
        try {
            const res = await fetch("http://localhost:5000/api/articles");

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
            const articles = await res.json();
    
            if (!articles.length) {
                pendingSection.innerHTML += "<p>No pending articles</p>";
                reviewedSection.innerHTML += "<p>No reviewed articles</p>";
                return;
            }
    
            // Clear existing articles
            pendingSection.querySelectorAll(".article").forEach(el => el.remove());
            reviewedSection.querySelectorAll(".article").forEach(el => el.remove());
    
            articles.forEach(article => {
                if (!article.status) {
                    console.error("❌ Error: Missing status for article", article);
                    return;  // Skip articles without a status
                }
            
                const articleDiv = document.createElement("div");
                articleDiv.classList.add("article");
            
                let articleContent = ` 
                    <div>
                        <strong>${article.author}</strong><br>
                        ${article.newsTitle}<br>
                        <span class="status ${article.status.toLowerCase()}">Status: ${article.status}</span>
                    </div>
                `;
            
                if (article.status.toLowerCase() === "pending") {
                    articleContent += `<button class="view-button" data-id="${article._id}">View</button>`;
                    pendingSection.appendChild(articleDiv);
                } else {
                    reviewedSection.appendChild(articleDiv);
                }
            
                articleDiv.innerHTML = articleContent;
            });
    
        } catch (error) {
            console.error("❌ Error fetching articles:", error);
            pendingSection.innerHTML += "<p>⚠️ Unable to fetch pending articles</p>";
            reviewedSection.innerHTML += "<p>⚠️ Unable to fetch reviewed articles</p>";
        }
    }

    // Handle "View" button click
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("view-button")) {
            const articleId = e.target.getAttribute("data-id");
            if (!articleId) return console.error("❌ No article ID found");

            // Redirect to the editor homepage with the selected article ID
            window.location.href = `Editor_Homepage.html?id=${articleId}`;
        }
    });

    loadArticles();
      // Get email from localStorage (set during login)
  const editorEmail = localStorage.getItem("editorEmail") || "unknown@editor.com";
  emailDisplay.textContent = editorEmail;

  // Show modal when person icon is clicked
  userIcon.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Hide modal
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("editorEmail");
      window.location.href = "login.html";
    }
  });
});
