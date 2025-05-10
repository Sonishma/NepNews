let editorInstance;
let currentArticleId;

function getArticleIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

ClassicEditor
  .create(document.querySelector('#editor'), {
    toolbar: [ 
      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList',
      'imageUpload', 'blockQuote', 'insertTable', 'undo', 'redo'
    ],
  })
  .then(editor => {
    editorInstance = editor;
    loadArticle();
  })
  .catch(error => {
    console.error("CKEditor error:", error);
  });

function loadArticle() {
  currentArticleId = getArticleIdFromURL();
  if (!currentArticleId) {
    alert("❌ No article ID provided.");
    return;
  }

  fetch(`http://localhost:5000/api/articles/${currentArticleId}`)
    .then(response => {
      if (!response.ok) throw new Error("Article not found.");
      return response.json();
    })
    .then(article => {
      document.getElementById("titleInput").value = article.newsTitle || '';
      editorInstance.setData(article.newsDescription || article.content || '');
    })
    .catch(err => {
      console.error("Failed to load article:", err);
      alert("⚠️ Failed to load article.");
    });
}

function saveArticle() {
  const updatedTitle = document.getElementById("titleInput").value.trim();
  const updatedContent = editorInstance.getData().trim();

  if (!updatedTitle || !updatedContent) {
    alert("⚠️ Title and content cannot be empty.");
    return;
  }

  fetch(`http://localhost:5000/api/articles/${currentArticleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newsTitle: updatedTitle,
      newsDescription: updatedContent
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message?.includes('saved') || data.message?.includes('updated')) {
      alert("✅ " + data.message);
    } else {
      alert("⚠️ Something unexpected happened.");
      console.warn(data);
    }
  })
  .catch(err => {
    console.error("Update failed:", err);
    alert("❌ Failed to save edited article.");
  });
}

// Drag-and-drop image handler
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".image-gallery img").forEach(img => {
    img.addEventListener("dragstart", e => {
      const imgTextContainer = `<div class="image-with-text">
                                  <img src="${img.src}" alt="Dropped Image" />
                                  <span>Image Description</span>
                                </div>`;
      e.dataTransfer.setData("text/html", imgTextContainer);
    });
  });

  const editorContainer = document.querySelector("#editor");

  editorContainer.addEventListener("drop", e => {
    e.preventDefault();
    const html = e.dataTransfer.getData("text/html");
    editorInstance.model.change(writer => {
      const viewFragment = editorInstance.data.processor.toView(html);
      const modelFragment = editorInstance.data.toModel(viewFragment);
      editorInstance.model.insertContent(modelFragment);
    });
  });

  editorContainer.addEventListener("dragover", e => e.preventDefault());
});
