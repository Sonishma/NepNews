// Alternative approach using DOMParser if you need to preserve formatting but remove unsafe HTML
document.addEventListener("DOMContentLoaded", () => {
  // Navigate to New Article page
  const createBox = document.querySelector(".create-box");
  if (createBox) {
    createBox.addEventListener("click", () => {
      window.location.href = "new.html";
    });
  }

  // Tab navigation
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const page = tab.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });

  /**
   * Safely parse HTML and extract text content
   * @param {string} html - The HTML string to sanitize
   * @return {string} - Clean text without HTML tags
   */
  function sanitizeHTML(html) {
    if (!html) return "";
    
    // Option 1: Simple regex replacement (removes all HTML tags)
    return html.replace(/<\/?[^>]+(>|$)/g, "");
    
    /* Option 2: Using DOMParser (safer but more complex)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
    */
  }

  // Fetch draft articles from backend
  fetch("http://localhost:5000/api/articles/author_draft")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch drafts");
      return res.json();
    })
    .then(drafts => {
      const container = document.getElementById("drafts-container");
      container.innerHTML = ''; // Clear container
      
      if(drafts.length === 0) {
        // Display a message if no drafts are available
        container.innerHTML = '<div class="no-drafts">No draft articles available</div>';
        return;
      }

      drafts.forEach(draft => {
        const card = document.createElement("div");
        card.className = "draft-card";
        
        let coverImagePath = "";
        
        if (draft.coverImage && draft.coverImage.trim() !== "") {
          // Normalize path if it exists
          coverImagePath = `http://localhost:5000/${draft.coverImage.replace(/\\/g, "/")}`;
        } else {
          // Fallback to placeholder
          coverImagePath = "../assets/placeholder.jpg"; // Update path as needed
        }
        
        // Create card elements individually to ensure button is always added
        const img = document.createElement("img");
        img.src = coverImagePath;
        img.alt = "Cover";
        img.className = "draft-cover";
        card.appendChild(img);
        
        const title = document.createElement("h3");
        // Sanitize the title to remove any HTML tags
        title.textContent = sanitizeHTML(draft.title);
        card.appendChild(title);
        
        const button = document.createElement("button");
        button.className = "continue-btn";
        button.setAttribute("data-id", draft._id);
        button.textContent = "Continue Writing";
        card.appendChild(button);
        
        container.appendChild(card);
      });

      // Add event listeners to buttons after they're added to DOM
      document.querySelectorAll(".continue-btn").forEach(button => {
        button.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent any default behavior
          const id = e.target.getAttribute("data-id");
          if (id) {
            window.location.href = `new.html?id=${id}`;
          } else {
            console.error("No article ID found");
          }
        });
      });
    })
    .catch(err => {
      console.error("Error loading drafts:", err);
      const container = document.getElementById("drafts-container");
      container.innerHTML = '<div class="error-message">Failed to load drafts. Please try again later.</div>';
    });
});