import { configDotenv } from 'dotenv';
import app from './app.js';
import http from 'http';
import connectDB from './Config/db.js';

// Load environment variables first
configDotenv();

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start server after successful DB connection
    const PORT = process.env.PORT || 3000;
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(`Error connecting to database: ${err.message}`);
    process.exit(1);
  });