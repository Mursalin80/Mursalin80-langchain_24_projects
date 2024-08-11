import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { config } from "dotenv";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import "cheerio";

config();

// coustum imports
import { prompt_rag as prompt } from "../prompt/prompt.js";
import { getVectorStore } from "../store/memoryVectorStore.js";

let retriever = await getVectorStore();

// let context = await retriever.invoke("what is task decomposition");

// context.map((ctx, i) => console.log(`🚀 ~ context:${i} = `, ctx.pageContent));

// const llm = new ChatVertexAI({
//   model: "gemini-1.5-pro",
//   temperature: 0,
// });

const llm = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "phi:2.7b",
  temperature: 0.5,
});

// let res = await llm.invoke("What is an llm's in computer science?");

// console.log("🚀 ~ res:", res.content);

const declarativeRagChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),

    question: new RunnablePassthrough(),
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

let res = await declarativeRagChain.invoke("What is task decomposition?");
console.log("🚀 ~ res:", res);
