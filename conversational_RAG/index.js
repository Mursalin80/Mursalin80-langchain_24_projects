import readline from "readline";
import "cheerio";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "dotenv";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// coustum imports
import { prompt_conversational as prompt } from "../prompt/prompt.js";
import { getVectorStore } from "../store/chromaVectorStore.js";

let retriever = await getVectorStore();
// console.log(prompt.promptMessages.map((msg) => msg.prompt.template).join("\n"));

const retrievedDocs = await retriever.invoke("what is task decomposition");

// console.log({ retrievedDocs });

const llm = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0,
});

const declarativeRagChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString).pipe((context) => {
      // console.log({ context });
      return context;
    }),

    question: new RunnablePassthrough().pipe((question) => {
      // console.log({ question });
      return question;
    }),
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

// let res = await declarativeRagChain.invoke("What is task decomposition?");

// ;
// console.log("🚀 ~ res:", res);

const sendTerminalCommand = () => {
  rl.question("Enter your Chat prompt: ", async (input) => {
    if (
      input.toLocaleLowerCase() === "exit" ||
      input.toLocaleLowerCase() === "quit"
    ) {
      console.log("Exiting...");
      rl.close();
    } else {
      let res = await declarativeRagChain.invoke(input);
      console.log("🚀 ~ res:", res);

      sendTerminalCommand();
    }
  });
};

sendTerminalCommand(); // Start the prompt
