document.addEventListener("DOMContentLoaded", async () => {
    const articleList = document.querySelector(".article-list");
    const titleField = document.getElementById("article-title");
    const authorField = document.getElementById("article-author");
    const categoryField = document.getElementById("article-category");
    const statusField = document.getElementById("article-status");
    const dateField = document.getElementById("article-date");
    const editorTextArea = document.getElementById("article-description");

    const approveBtnRight = document.getElementById("approveButton");

    let articles = [];
    let currentArticleId = null;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedId = urlParams.get("id");

    async function loadArticles() {
        try {
            const res = await fetch("http://localhost:5000/api/articles");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            articles = await res.json();
            articleList.innerHTML = "";

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

                if (article._id === selectedId) {
                    li.classList.add("selected");
                    showArticle(article);
                    currentArticleId = article._id;
                    viewBtn.style.display = "none";
                }

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

    function showArticle(article) {
        if (!article) return;

        titleField.textContent = article.newsTitle;
        authorField.textContent = article.author;
        categoryField.textContent = article.categories[0] || "Uncategorized";
        statusField.textContent = article.status;
        dateField.textContent = `Date: ${article.date}`;
        editorTextArea.value = article.newsDescription;

        currentArticleId = article._id;
    }

    articleList.addEventListener("click", async function (e) {
        const target = e.target;

        if (target.classList.contains("view-btn")) {
            const articleId = target.getAttribute("data-id");
            const selectedArticle = articles.find(a => a._id === articleId);
            if (!selectedArticle) return;

            showArticle(selectedArticle);

            const allItems = document.querySelectorAll(".article-list li");
            allItems.forEach(li => li.classList.remove("selected"));
            target.parentElement.classList.add("selected");

            allItems.forEach(li => {
                const btn = li.querySelector(".view-btn");
                if (btn) btn.style.display = "inline";
            });
            target.style.display = "none";
        }
    });

    approveBtnRight.addEventListener("click", async () => {
    if (!currentArticleId) {
        alert("No article selected to approve.");
        return;
    }

    const confirmApprove = confirm("Are you sure you want to approve this article?");
    if (!confirmApprove) return;

    try {
     const response = await fetch(`http://localhost:5000/api/articles/${currentArticleId}/approve`, {
        
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
    },
    
        });

        if (!response.ok) {
            throw new Error("Failed to approve the article.");
        }

        alert("✅ Article approved successfully.");
        await loadArticles();

        // Refresh right side details
        const updatedArticle = articles.find(a => a._id === currentArticleId);
        if (updatedArticle) showArticle(updatedArticle);
    } catch (err) {
        console.error("❌ Error approving article:", err);
        alert("Failed to approve the article.");
    }
});


    document.getElementById("edit-article-btn").addEventListener("click", () => {
        if (!currentArticleId) {
            alert("No article selected to edit.");
            return;
        }

        window.location.href = `Artical_editor.html?id=${currentArticleId}`;
    });

    loadArticles();
});
