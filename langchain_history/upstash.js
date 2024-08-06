import { ChatGoogleGenerativeAI as Genai } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { config as dotenvConfig } from "dotenv";

import { v1 as uuidv1 } from "uuid";

// Generate a new UUID for the session ID
dotenvConfig();
const sessionId = uuidv1();

// Instantiate your model and create a prompt:
const model = new Genai({
  temperature: 0.9,
  apiKey: process.env.GOOGLE_API_KEY,
});
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// chain
const chain = prompt.pipe(model);

// Create a RunnableWithMessageHistory object, passing in the runnable
const chain_withHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId) => {
    // console.log({ _sessionId });
    return new UpstashRedisChatMessageHistory({
      sessionId: _sessionId,
      config: {
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
        url: process.env.UPSTASH_REDIS_REST_URL,
      },
    });
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history", // Set this based on your MessagesPlaceholder
});

//   Create a configurable object with a sessionId to identify chat sessions
const config = {
  configurable: {
    sessionId,
  },
};

const output = await chain_withHistory.invoke(
  { input: "explain JS Array?" },
  config
);
console.log("🚀 ~ output:", output.content);

// Output 1: "Hello, Archibald! How can I assist you today?"

// You can continue the conversation:
const nextOutput = await chain_withHistory.invoke(
  { input: "how to add new element?" },
  config
);
console.log("🚀 ~ nextOutput:", nextOutput.content);

// Output 2: "Your name is Archibald, as you mentioned earlier."
