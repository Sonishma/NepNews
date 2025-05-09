document.addEventListener("DOMContentLoaded", async () => {
    const articleList = document.querySelector(".article-list");
    const titleField = document.getElementById("article-title");
    const authorField = document.getElementById("article-author");
    const categoryField = document.getElementById("article-category"); // Added category selector
    const statusField = document.getElementById("article-status");
    const dateField = document.getElementById("article-date");
    const editorTextArea = document.getElementById("article-description");

    let articles = [];
    let currentArticleId = null;

    // Read ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedId = urlParams.get("id");

    // Load articles from API
    async function loadArticles() {
        try {
            const res = await fetch("http://localhost:5000/api/articles");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            articles = await res.json();

            articleList.innerHTML = ""; // Clear old list

            articles.forEach((article) => {
                const li = document.createElement("li");
                li.classList.add(article.status.toLowerCase());
                li.setAttribute("data-id", article._id);

                li.innerHTML = `
                    <strong>${article.author}</strong><br>
                    <span>${article.newsTitle}</span><br>
                  
                    Status: ${article.status}
                `;

                const viewBtn = document.createElement("button");
                viewBtn.classList.add("view-btn");
                viewBtn.setAttribute("data-id", article._id);
                viewBtn.textContent = "View";

                // Show the selected article and highlight it
                if (article._id === selectedId) {
                    li.classList.add("selected");
                    showArticle(article);
                    currentArticleId = article._id;
                    viewBtn.style.display = "none";
                }

                // Only show "View" button for pending articles
                if (article.status.toLowerCase() === "pending") {
                    li.appendChild(viewBtn);
                }

                articleList.appendChild(li);
            });

        } catch (error) {
            console.error("❌ Error fetching articles:", error);
            articleList.innerHTML = "<p>Failed to load articles.</p>";
        }
    }

    // Display article details in editor
    function showArticle(article) {
        if (!article) return;

        titleField.textContent = article.newsTitle;
        authorField.textContent = article.author;
        categoryField.textContent = article.category || "Uncategorized"; // Display category
        statusField.textContent = article.status;
        dateField.textContent = `Date: ${article.date}`;
        editorTextArea.value = article.newsDescription;
    }

    // Handle View button click
    articleList.addEventListener("click", function (e) {
        if (e.target.classList.contains("view-btn")) {
            const articleId = e.target.getAttribute("data-id");
            const selectedArticle = articles.find(a => a._id === articleId);
            if (!selectedArticle) return;

            // Show the article in the editor
            showArticle(selectedArticle);
            currentArticleId = articleId;

            // Highlight selected article
            const allItems = document.querySelectorAll(".article-list li");
            allItems.forEach(li => li.classList.remove("selected"));
            e.target.parentElement.classList.add("selected");

            // Hide other "View" buttons
            allItems.forEach(li => {
                const btn = li.querySelector(".view-btn");
                if (btn) btn.style.display = "inline";
            });
            e.target.style.display = "none";
        }
    });

    // Edit button functionality
    document.getElementById("edit-article-btn").addEventListener("click", () => {
        if (!currentArticleId) {
            alert("No article selected to edit.");
            return;
        }

        window.location.href = `Artical_editor.html?id=${currentArticleId}`;
    });

    loadArticles();
});