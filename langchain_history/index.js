import { ChatGoogleGenerativeAI as Genai } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { config as dotenvConfig } from "dotenv";

import { v4 as uuidv4 } from "uuid";

// Generate a new UUID for the session ID
dotenvConfig();
const sessionId = uuidv4();

// Instantiate your model and create a prompt:
const model = new Genai({
  temperature: 0.9,
  apiKey: process.env.GOOGLE_API_KEY,
});
const prompt = ChatPromptTemplate.fromMessages([
  ["ai", "You are a helpful assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// console.log({prompt})

// chain
const chain = prompt.pipe(model);

// console.log({runnable})

// history
const messageHistory = new ChatMessageHistory();

// console.log({ messageHistory });

// Create a RunnableWithMessageHistory object, passing in the runnable

const chain_withHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history", // Set this based on your MessagesPlaceholder
});

//   Create a configurable object with a sessionId to identify chat sessions
const config = {
  configurable: {
    sessionId: sessionId,
  },
};

//   run with history

const output = await chain_withHistory.invoke(
  {
    input: "Hello there, I'm Mursalin!",
  },
  config
);

console.log("Output 1:", output.content);
// Output 1: "Hello, Archibald! How can I assist you today?"

// You can continue the conversation:
const nextOutput = await chain_withHistory.invoke(
  {
    input: "What's my name?",
  },
  config
);

console.log("Output 2:", nextOutput.content);
// Output 2: "Your name is Archibald, as you mentioned earlier."
