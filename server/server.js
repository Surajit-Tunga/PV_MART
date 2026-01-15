require("dotenv").config()         // Load .env variables
const app = require("./app")       // Import Express app
const connectDB = require("./config/db")  // MongoDB connection function

const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

