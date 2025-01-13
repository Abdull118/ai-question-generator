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

  const { collectionName, folder, fileName, id, ipAddress, completed, correct } = req.body;

  if (!collectionName || !folder || !fileName || !id) {
    return res.status(400).json({ error: 'Missing required fields: collectionName, folder, fileName, or id' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('test'); 
    const collection = db.collection(collectionName);

    // Check if metadata exists for the specific IP address
    const questionFilter = { folder, fileName, 'questions.id': id };
    const existingQuestion = await collection.findOne(questionFilter);

    if (existingQuestion) {
      const questionIndex = existingQuestion.questions.findIndex(q => q.id === id);
      if (questionIndex !== -1) {
        const metadataIndex = existingQuestion.questions[questionIndex].metadata?.findIndex(meta => meta.ipAddress === ipAddress);

        if (metadataIndex !== undefined && metadataIndex !== -1) {
          // Update existing metadata
          await collection.updateOne(
            { ...questionFilter, [`questions.${questionIndex}.metadata.${metadataIndex}.ipAddress`]: ipAddress },
            {
              $set: {
                [`questions.${questionIndex}.metadata.${metadataIndex}.correct`]: correct,
                [`questions.${questionIndex}.metadata.${metadataIndex}.updatedAt`]: new Date(),
              },
            }
          );
        } else {
          // Add new metadata if it doesn't exist
          await collection.updateOne(
            questionFilter,
            {
              $push: {
                [`questions.${questionIndex}.metadata`]: {
                  ipAddress,
                  completed,
                  correct,
                  updatedAt: new Date(),
                },
              },
            }
          );
        }
      }
    }

    res.status(200).json({ message: 'Metadata updated successfully' });
  } catch (error) {
    console.error('Failed to update data:', error);
    res.status(500).json({ error: 'Failed to update data in the database' });
  }
}