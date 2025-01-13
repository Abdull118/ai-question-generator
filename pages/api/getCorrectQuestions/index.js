import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  cachedClient = await client.connect();
  return cachedClient;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { collectionName, folder, fileName, ipAddress } = req.body;

  if (!collectionName || !folder || !fileName || !ipAddress) {
    return res.status(400).json({ error: 'Missing required fields: collectionName, folder, fileName, or ipAddress' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('test');
    const collection = db.collection(collectionName);

    // Retrieve the document matching the folder and fileName
    const document = await collection.findOne({ folder, fileName });

    if (!document || !document.questions) {
      return res.status(404).json({ error: 'No matching questions found' });
    }

    // Filter questions based on metadata presence and ipAddress
    const filteredQuestions = document.questions.filter(
      (question) =>
        question.metadata &&
        question.metadata.some((meta) => meta.ipAddress === ipAddress && meta.correct === true)
    );

    res.status(200).json(filteredQuestions);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the database' });
  }
}
