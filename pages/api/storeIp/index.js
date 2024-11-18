import { connectToDatabase } from '../../../utils/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection('IP Addresses');

    // Store the IP address and timestamp
    const { ip } = req.body;
    const timestamp = new Date();

    await collection.insertOne({ ip, timestamp });

    res.status(200).json({ message: 'IP address stored successfully' });
  } catch (error) {
    console.error('Failed to store IP address:', error);
    res.status(500).json({ error: 'Failed to store IP address' });
  }
}