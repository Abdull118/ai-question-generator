import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in your .env.local file
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, answerChoices, correctAnswer, selectedAnswer } = req.body;

  if (!question || !answerChoices || !correctAnswer || !selectedAnswer) {
    return res.status(400).json({ error: 'All data fields are required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an AI that provides explanations for questions.',
        },
        {
          role: 'user',
          content: `Question: ${question}\nAnswer Choices: ${answerChoices.join(', ')}\nCorrect Answer: ${correctAnswer}\nUser Selected Answer: ${selectedAnswer}\n\nPlease explain why the correct answer is correct and why the user's selected answer is incorrect (if applicable).`,
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        "type": "text"
      }
    });

    console.log(response.choices[0].message)

    // Extract the content from the response
    const explanationText = response.choices[0].message.content;

    res.status(200).json({ explanationText });
  } catch (error) {
    console.error('Failed to get explanation from GPT-4:', error);
    res.status(500).json({ error: 'Failed to get explanation from GPT-4' });
  }
}
