// let editorInstance;

// document.addEventListener('DOMContentLoaded', function() {
//     const params = new URLSearchParams(window.location.search);
//     const articleId = params.get("id");

//     if (!articleId) {
//         alert("No article ID provided.");
//         return;
//     }

//     // Fetch the article by ID
//     fetch(`http://localhost:5000/api/articles/${articleId}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Article not found");
//             }
//             return response.json();
//         })
//         .then(article => {
//             // Populate the editor with article data
//             document.querySelector('.title').value = article.title;
//             document.querySelector('.description').value = article.description;
//             // And so on for other fields...
//         })
//         .catch(error => {
//             console.error("Error loading article:", error);
//             alert("Failed to load article.");
//         });
// });

// function loadArticleIntoEditor(article) {
//   ClassicEditor.create(document.querySelector('#editor'), {
//     toolbar: [
//       'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
//       'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
//     ],
//     image: {
//       toolbar: [
//         'imageTextAlternative', 'toggleImageCaption', '|',
//         'imageStyle:inline', 'imageStyle:block', 'imageStyle:side',
//         'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight', '|',
//         'resizeImage'
//       ],
//       styles: ['alignLeft', 'alignCenter', 'alignRight'],
//       resizeOptions: [
//         { name: 'resizeImage:original', label: 'Original', value: null },
//         { name: 'resizeImage:50', label: '50%', value: '50' },
//         { name: 'resizeImage:75', label: '75%', value: '75' }
//       ]
//     }
//   }).then(editor => {
//     editorInstance = editor;
//     editor.setData(article.description || "<p>No content</p>");
//   }).catch(console.error);

//   // Add cover image and other images
//   if (article.coverImage) addImageToGallery(article.coverImage);
//   if (Array.isArray(article.otherImages)) {
//     article.otherImages.forEach(addImageToGallery);
//   }
// }

// const demoImages = [
//   "https://picsum.photos/100/100?random=1",
//   "https://picsum.photos/100/100?random=2",
//   "https://picsum.photos/100/100?random=3"
// ];

// function addImageToGallery(url) {
//   const img = document.createElement("img");
//   img.src = url;
//   img.className = "image-preview";
//   img.setAttribute("draggable", true);
//   img.addEventListener("dragstart", e => {
//     e.dataTransfer.setData("imageUrl", url);
//   });
//   img.addEventListener("dblclick", () => {
//     const editorArea = editorInstance.ui.view.editable.element;
//     const newImg = document.createElement("img");
//     newImg.src = url;
//     newImg.className = "draggable-img";
//     newImg.style.left = "100px";
//     newImg.style.top = "100px";
//     newImg.width = 200;
//     editorArea.appendChild(newImg);
//     makeImageDraggable(newImg);
//   });
//   document.getElementById("imageGallery").appendChild(img);
// }

// demoImages.forEach(addImageToGallery);

// document.getElementById("imageUpload").addEventListener("change", function (e) {
//   const files = e.target.files;
//   Array.from(files).forEach(file => {
//     const reader = new FileReader();
//     reader.onload = evt => addImageToGallery(evt.target.result);
//     reader.readAsDataURL(file);
//   });
//   document.getElementById("uploadStatus").textContent = `${files.length} image(s) uploaded.`;
//   setTimeout(() => document.getElementById("uploadStatus").textContent = '', 3000);
// });

// function makeImageDraggable(img) {
//   let isDragging = false;
//   let offsetX, offsetY;

//   img.addEventListener('mousedown', e => {
//     isDragging = true;
//     offsetX = e.offsetX;
//     offsetY = e.offsetY;
//   });

//   document.addEventListener('mousemove', e => {
//     if (isDragging) {
//       const editorBounds = editorInstance.ui.view.editable.element.getBoundingClientRect();
//       const x = e.clientX - editorBounds.left - offsetX;
//       const y = e.clientY - editorBounds.top - offsetY;
//       img.style.left = `${x}px`;
//       img.style.top = `${y}px`;
//     }
//   });

//   document.addEventListener('mouseup', () => {
//     isDragging = false;
//   });
// }

// function saveArticle() {
//   const articleData = {
//     title: "Sample Title",
//     author: "Editor Name",
//     content: editorInstance.getData(),
//     status: "Pending"
//   };

//   fetch('http://localhost:5000/articles', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(articleData)
//   })
//     .then(res => res.json())
//     .then(data => {
//       alert("Article saved successfully!");
//       console.log(data);
//     });
// }

// function previewArticle() {
//   document.getElementById("previewContent").innerHTML = editorInstance.getData();
//   document.getElementById("previewModal").style.display = 'block';
// }

// function closePreview() {
//   document.getElementById("previewModal").style.display = 'none';
// }