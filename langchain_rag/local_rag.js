import { ChatVertexAI } from "@langchain/google-vertexai";
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
import { customRagPrompt as prompt } from "../prompt/prompt.js";
import { getVectorStore } from "../store/memoryVectorStore.js";

const embeddings = new OllamaEmbeddings();

let retriever = await getVectorStore();

// const retrievedDocs = await retriever.invoke("what is task decomposition");
// console.log({ retrievedDocs });

const llm = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0,
});

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
