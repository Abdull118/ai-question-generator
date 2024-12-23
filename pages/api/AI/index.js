import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure the key is set up correctly
    });

    // Extract folder and fileName from request body
    const { folder, fileName, sampleQuestions } = req.body;

    if (!folder || !fileName || !sampleQuestions) {
      return res.status(400).json({ error: "Folder, fileName, and sampleQuestions are required." });
    }

    // Construct the file path dynamically
    const filePath = path.join(process.cwd(), "data", folder, fileName);

    // Read the file content
    const data = await fs.readFile(filePath, "utf-8");

    // Create the assistant
    const assistant = await openai.beta.assistants.create({
      name: "Data Question Generator",
      instructions:
        "You are a question generator. Based on provided data and sample questions, generate a new question in the same style.",
      model: "gpt-4o",
    });

    // Create a new conversation
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `
Data:
${data}

Sample Questions:
${sampleQuestions}

Generate 5 new questions in the same style as the examples. Return the data in a JSON Object in the format: question, answer choices, answer
      `,
    });

    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
      instructions: "Please only return the JSON object, no other information.",
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);

      // Find the most recent assistant message
      const assistantMessage = messages.data.find((msg) => msg.role === "assistant");

      if (assistantMessage) {
        // Extract and clean the content
        const content = assistantMessage.content[0].text.value;

        // Parse and clean the JSON content
        const cleanedContent = content.replace(/```json|```/g, "").trim();

        // Ensure it is valid JSON
        const jsonResponse = JSON.parse(cleanedContent);

        return res.status(200).json(jsonResponse); // Directly return the parsed JSON object
      } else {
        return res.status(500).json({ error: "Assistant response not found." });
      }
    } else {
      return res.status(500).json({ error: `Run status: ${run.status}` });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "An error occurred while generating the question." });
  }
}
