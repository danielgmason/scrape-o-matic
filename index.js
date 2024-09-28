const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const cron = require('node-cron');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();
const port = process.env.PORT || 3000;

// Clerk configuration
const clerkMiddleware = ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY
  });

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;  // This will help surface the error
    }
  }
  
// Connect to MongoDB when the app starts
connectToDatabase().catch(console.error);


app.use(express.json());
app.use(express.static('public'));

// Public routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
  });

// Protected routes
app.use(clerkMiddleware);

app.post('/api/add-job', async (req, res) => {
    const { url, interval } = req.body;
    try {
      // Here you would add logic to schedule the job
      // For now, we'll just send a success response
      res.json({ message: 'Job added successfully' });
    } catch (error) {
      console.error('Error adding job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/get-scrapes', async (req, res) => {
    const { url } = req.query;
    try {
      const db = client.db('web_scraper');
      const scrapes = db.collection('scrapes');
      const results = await scrapes.find({ url }).sort({ timestamp: -1 }).toArray();
      res.json(results);
    } catch (error) {
      console.error('Error fetching scrapes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.post('/api/add-job', async (req, res) => {
    const { url, interval } = req.body;
    try {
      // Here you would add logic to schedule the job
      // For now, we'll just send a success response
      res.json({ message: 'Job added successfully' });
    } catch (error) {
      console.error('Error adding job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.get('/api/get-scrapes', async (req, res) => {
    const { url } = req.query;
    try {
      const db = client.db('web_scraper');
      const scrapes = db.collection('scrapes');
      const results = await scrapes.find({ url }).sort({ timestamp: -1 }).toArray();
      res.json(results);
    } catch (error) {
      console.error('Error fetching scrapes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Catch-all route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });