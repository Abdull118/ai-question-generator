import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true, // This option is fine to use
  });

  cachedClient = await client.connect(); // Return directly from connect method
  return cachedClient;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { collectionName } = req.body;

  if (!collectionName) {
    return res.status(400).json({ error: 'Collection name is required' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('Questions'); // Connect to the database named "Questions"
    const collection = db.collection(collectionName); // Access the collection passed from the frontend

    // Retrieve all documents from the collection
    const questions = await collection.find({}).toArray();

    // Return the data as a JSON response
    res.status(200).json(questions);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the database' });
  }
}
