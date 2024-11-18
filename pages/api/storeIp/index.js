import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection('IP Addresses');

    // Extract IP address and lecture from the request body
    const { ip, lecture } = req.body;
    const timestamp = new Date();

    // Insert the data into the database
    await collection.insertOne({ ip, lecture, timestamp });

    res.status(200).json({ message: 'IP address and lecture stored successfully' });
  } catch (error) {
    console.error('Failed to store IP address and lecture:', error);
    res.status(500).json({ error: 'Failed to store IP address and lecture' });
  }
}
