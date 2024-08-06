import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 1048, // 2048
  apiKey: process.env.GOOGLE_API_KEY,
});
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant who remembers all details the user shares with you.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

let chain = prompt.pipe(model).pipe(new StringOutputParser());

const messageHistories = {};
const config = {
  configurable: {
    sessionId: "Mur_111",
  },
};

const withMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (messageHistories[sessionId] === undefined) {
      messageHistories[sessionId] = new InMemoryChatMessageHistory();
    }
    return messageHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

// let output =await chain.invoke([new HumanMessage({ content: "Hi! I'm Bob" })])
// console.log({output})
