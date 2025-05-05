// // Load environment variables at the top
// require('dotenv').config();
// console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI); 

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Make sure this path is correct

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Check and use MongoDB URI
// const mongoURI = process.env.MONGO_URI;

// if (!mongoURI) {
//   console.error("❌ MONGO_URI not found in .env");
//   process.exit(1); // Stop the server if the URI is missing
// }

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB connected successfully"))
// .catch(err => {
//   console.error("❌ MongoDB connection error:", err);
//   process.exit(1); // Exit on connection error
// });

// // Routes
// app.use('/api/auth', authRoutes);

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
// app.get('/', (req, res) => {
//   res.send('🚀 Auth API is running!');
// });

// Load environment variables at the top
require('dotenv').config();
console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Make sure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));

app.use(express.json());


// Check and use MongoDB URI
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1); // Stop the server if the URI is missing
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // Exit on connection error

});

// Routes
 app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Home route for testing
app.get('/', (req, res) => {
  res.send('🚀 Auth API is running!');
});
