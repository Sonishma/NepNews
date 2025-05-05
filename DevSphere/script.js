// Toggle Search Area
function toggleSearchArea() {
    const searchContainer = document.getElementById("searchContainer");
    searchContainer.style.display = searchContainer.style.display === "flex" ? "none" : "flex";
}

function closeSearchArea() {
    document.getElementById("searchContainer").style.display = "none";
}
// Open and close the authentication modal
function openAuthModal() {
    document.getElementById("authModal").style.display = "flex";

    // Initially hide all forms and show only the login form
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const passwordResetMessage = document.getElementById("passwordResetMessage");

    loginForm.style.display = "block";
    signupForm.style.display = "none"; // Initially hide signup form
    forgotPasswordForm.style.display = "none"; // Initially hide forgot password form
    passwordResetMessage.style.display = "none"; // Initially hide password reset confirmation
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

// Switch between login, signup, and forgot password forms
function toggleForm(formType) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const passwordResetMessage = document.getElementById("passwordResetMessage");

    // Hide all forms first
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    forgotPasswordForm.style.display = "none";
    passwordResetMessage.style.display = "none";

    // Show the selected form
    if (formType === 'signup') {
        signupForm.style.display = "block";
    } else if (formType === 'forgotPassword') {
        forgotPasswordForm.style.display = "block";
    } else if (formType === 'passwordResetMessage') {
        passwordResetMessage.style.display = "block";
    } else {
        loginForm.style.display = "block";
    }
}

// Toggle the password visibility
function togglePassword(inputId, iconElement) {
    const inputField = document.getElementById(inputId);
    const icon = iconElement;

    // Toggle password visibility
    if (inputField.type === "password") {
        inputField.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        inputField.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// Validate login form
function validateLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    emailError.textContent = ""; // Clear previous errors
    passwordError.textContent = ""; // Clear previous password errors

    // Simple validation: check if email and password are not empty
    let isValid = true;

    if (email === "") {
        emailError.textContent = "Please enter your email";
        isValid = false;
    }

    if (password === "") {
        passwordError.textContent = "Please enter your password";
        isValid = false;
    }

    // Additional validation can be added here, e.g., email format check
    if (!isValid) {
        return false;
    }

    // You can proceed with the login if everything is validated
    // For now, we just return true
    return true;
}


// Reset the password
function resetPassword() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    // Simple password match check
    if (newPassword === "" || confirmNewPassword === "") {
        alert("Please fill in both fields.");
        return false;
    }

    if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match.");
        return false;
    }

    // Simulate password reset success
    alert("Your password has been successfully reset.");
    toggleForm('passwordResetMessage');
}
function loadCategory(category) {
    // Hide all news categories
    const categories = document.querySelectorAll('.news-category');
    categories.forEach(cat => cat.style.display = 'none');

    // Show the selected category only if it exists
    const selectedCategory = document.getElementById(category);
    if (selectedCategory) {
        selectedCategory.style.display = 'block';
    }
}

// Function to show full content on clicking the 'Read More' link
function showFullContent(newsId) {
    var fullContent = document.getElementById('full-content-' + newsId);
    
    // Toggle the display of the full content
    if (fullContent.style.display === "none" || fullContent.style.display === "") {
        fullContent.style.display = "block";  // Show the full content
    } else {
        fullContent.style.display = "none";  // Hide the full content
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const newsItems = document.querySelectorAll(".news-item");
    const fullNewsContainer = document.createElement("div");
    fullNewsContainer.classList.add("full-news");
    document.body.appendChild(fullNewsContainer);

    newsItems.forEach((item) => {
        item.addEventListener("click", function () {
            const title = this.querySelector("h4").textContent;
            const imgSrc = this.querySelector("img").src;
            const description = this.querySelector(".short-desc").textContent;
            const timeCountry = this.querySelector(".time-country").innerHTML;

            fullNewsContainer.innerHTML = `
                <button id="back-btn">← Back</button>
                <div class="full-news-content">
                    <h2>${title}</h2>
                    <img src="${imgSrc}" alt="News Image">
                    <p class="time-country">${timeCountry}</p>
                    <p>${description} More details about the news will appear here...</p>
                </div>
            `;

            document.querySelector("main").style.display = "none"; // Hide all news
            fullNewsContainer.style.display = "block"; // Show full news

            document.querySelector("#back-btn").addEventListener("click", function () {
                fullNewsContainer.style.display = "none";
                document.querySelector("main").style.display = "block"; // Restore the news list
            });
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const readMoreLinks = document.querySelectorAll(".read-more");

    readMoreLinks.forEach((link) => {
        link.addEventListener("click", function () {
            const fullContent = this.nextElementSibling;

            if (fullContent.style.display === "none" || fullContent.style.display === "") {
                fullContent.style.display = "block";
                this.textContent = "Read Less";
            } else {
                fullContent.style.display = "none";
                this.textContent = "Read More";
            }
        });
    });
});

// function loadCategory(category) {
//     // Hide all categories
//     const allCategories = document.querySelectorAll('.category-content');
//     allCategories.forEach(categorySection => {
//         categorySection.style.display = 'none';
//     });

//     // Show the selected category
//     const selectedCategory = document.getElementById(category);
//     if (selectedCategory) {
//         selectedCategory.style.display = 'block';
//     }

//     // Optional: You can load content dynamically based on the category.
//     // For example, an API call or change content based on the category.
//     updateContent(category);
// }

// function openModal(title, content, imageSrc) {
//     document.getElementById('modal-title').innerText = title;
//     document.getElementById('modal-content').innerText = content;
//     document.getElementById('modal-image').src = imageSrc;

//     // Display the modal
//     document.getElementById('news-modal').style.display = "block";
// }

// // Close modal when the close button is clicked
// document.getElementById('close-modal').onclick = function() {
//     document.getElementById('news-modal').style.display = "none";
// }

// // Close modal if the user clicks outside of the modal content
// window.onclick = function(event) {
//     if (event.target === document.getElementById('news-modal')) {
//         document.getElementById('news-modal').style.display = "none";
//     }
// }

// function showFullContent() {
//     document.querySelector('.summary-content').style.display = 'none';
//     document.querySelector('.full-content').style.display = 'block';
// }

// function hideFullContent() {
//     document.querySelector('.summary-content').style.display = 'block';
//     document.querySelector('.full-content').style.display = 'none';
// }
// // // API Keys and URLs
// const newsApiKey = '4c0824ec9fa144c496272bdb9d5ef991'; // News API Key (International)
// const nepaliApiKey = 'pub_76850b614c020cb2a7494b1a9df04eb08e0ed'; // Nepali API Key (Kathmandu & Culture)
// const nasaApiKey = 'wCRwO2GXG49O269XEBQTB5IOHP5sSIa4lyNBvQPe'; // NASA API Key (Earth Images)

// const newsApiUrl = 'https://newsapi.org/v2/top-headlines';
// const nepaliApiUrl = 'https://newsdata.io/api/1/news'; // Corrected endpoint for fetching Nepali news articles
// const nasaApiUrl = 'https://api.nasa.gov/planetary/earth/imagery'; // NASA Earth API

// // Fetch and display news based on the selected category
// function loadCategory(category) {
//     updateActiveNav(category); // Highlight active category
//     let url = '';

//     if (category === 'kathmandu' || category === 'culture') {
//         // Nepali API for Kathmandu & Culture
//         url = `${nepaliApiUrl}?apikey=${nepaliApiKey}&country=np`; // Corrected query to fetch news articles for Nepal
//     } else if (category === 'earth') {
//         // NASA API for Earth category (Image response)
//         url = `${nasaApiUrl}?lon=85.3240&lat=27.7172&dim=0.1&api_key=${nasaApiKey}`;
//     } else {
//         // News API for other categories
//         const categoryParam = getCategoryQuery(category);
//         url = `${newsApiUrl}?country=us${categoryParam}&apiKey=${newsApiKey}`;
//     }

//     console.log('Fetching URL:', url); // Debugging

//     fetch(url, { headers: { 'Accept': 'application/json' } })
//         .then(response => {
//             console.log('Raw response:', response);
//             if (!response.ok) {
//                 throw new Error(`API Error: ${response.status} - ${response.statusText}`);
//             }

//             // NASA API returns an image, so handle it differently
//             if (category === 'earth') {
//                 return response.blob(); // Convert response to binary image data
//             } else {
//                 return response.json(); // Convert to JSON for news APIs
//             }
//         })
//         .then(data => {
//             console.log('API Response:', data); // Debugging
//             let articles = [];

//             if (category === 'earth') {
//                 // Create object with image URL
//                 const imageUrl = URL.createObjectURL(data);
//                 articles = [{
//                     title: 'NASA Earth Image',
//                     urlToImage: imageUrl,
//                     description: 'Satellite image from NASA Earth Observatory.',
//                     url: imageUrl
//                 }];
//             } else {
//                 // Updated this part to handle the response correctly for Nepali news
//                 articles = data.results || data.articles || [];
//             }

//             displayNews(articles);
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             document.getElementById('content-area').innerHTML = `<p>Error loading news: ${error.message}</p>`;
//         });
// }

// // Function to determine the correct query for the category
// function getCategoryQuery(category) {
//     switch (category) {
//         case 'news': return '&category=general';
//         case 'sports': return '&category=sports';
//         case 'health': return '&category=health';
//         case 'arts': return '&q=arts';
//         case 'travel': return '&q=travel';
//         case 'earth': return '&q=earth';
//         case 'f1': return '&q=f1';
//         default: return '';
//     }
// }

// // Function to display news articles
// function displayNews(articles) {
//     const contentArea = document.getElementById('content-area');
//     contentArea.innerHTML = ''; // Clear previous content

//     // Check if articles are available
//     if (articles.length === 0) {
//         contentArea.innerHTML = `<p>No news available for this category.</p>`;
//         return;
//     }

//     // Featured Article Section (Use the first article as the featured one)
//     const featuredArticle = articles[0];

//     const featuredSection = document.createElement('div');
//     featuredSection.classList.add('featured-article');
//     featuredSection.innerHTML = `
//         <img src="${featuredArticle.urlToImage || 'https://via.placeholder.com/500'}" alt="Featured Image">
//         <div class="featured-text">
//             <h2>${featuredArticle.title}</h2>
//             <p>${featuredArticle.description || 'No description available.'}</p>
//             <a href="#" class="read-more" onclick="showFullNews('${featuredArticle.url}')">Read More</a>
//         </div>
//     `;
//     contentArea.appendChild(featuredSection);

//     // News Grid Section (for the rest of the articles)
//     const newsGrid = document.createElement('div');
//     newsGrid.classList.add('news-grid');

//     // Loop through the rest of the articles and display them in cards
//     articles.slice(1).forEach(article => {
//         const newsCard = document.createElement('div');
//         newsCard.classList.add('news-card');
//         newsCard.innerHTML = `
//             <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="News Image">
//             <h3>${article.title}</h3>
//             <p>${article.description || 'No description available.'}</p>
//             <a href="#" class="read-more" onclick="showFullNews('${article.url}')">Read More</a>
//         `;
//         newsGrid.appendChild(newsCard);
//     });

//     contentArea.appendChild(newsGrid);
// }

// // Function to show full news when a card is clicked
// function showFullNews(url) {
//     window.open(url, '_blank');
// }


// // Close the modal
// function closeModal() {
//     const modal = document.querySelector('.modal');
//     if (modal) {
//         modal.remove();
//     }
// }

// // Update the active class on the navigation links
// function updateActiveNav(category) {
//     const navLinks = document.querySelectorAll('.main-nav ul li a');
//     navLinks.forEach(link => {
//         if (link.innerText.toLowerCase() === category) {
//             link.classList.add('active');
//         } else {
//             link.classList.remove('active');
//         }
//     });
// }

// // Initial load (e.g., when the page is first opened)
// loadCategory('home');
 
