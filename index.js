const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection string (replace with your actual connection string)
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Jina AI API key
const JINA_API_KEY = process.env.JINA_API_KEY;

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('web_scraper');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connectToDatabase();

const jobs = new Map();

async function scrapeWebsite(url) {
  try {
    const response = await axios.post('https://api.jina.ai/v1/web', 
      { url },
      {
        headers: {
          'Authorization': `Bearer ${JINA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = JSON.stringify(response.data);
    const timestamp = new Date();

    const scrapes = db.collection('scrapes');
    await scrapes.insertOne({ url, content, timestamp });

    console.log(`Scraped ${url} at ${timestamp}`);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}

app.post('/api/add-job', (req, res) => {
  const { url, interval } = req.body;
  
  if (jobs.has(url)) {
    jobs.get(url).stop();
  }

  const job = cron.schedule(`*/${interval} * * * *`, () => {
    scrapeWebsite(url);
  });

  jobs.set(url, job);

  res.json({ message: 'Job added successfully' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.get('/api/get-scrapes', async (req, res) => {
  const { url } = req.query;
  
  try {
    const scrapes = db.collection('scrapes');
    const results = await scrapes.find({ url }).sort({ timestamp: -1 }).toArray();
    res.json(results);
  } catch (error) {
    console.error('Error fetching scrapes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;