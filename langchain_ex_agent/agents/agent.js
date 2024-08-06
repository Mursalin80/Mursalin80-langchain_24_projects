import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

import {tools} from '../tools/tools.js'

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 1048, // 2048
  apiKey: "AIzaSyDY9iodITqOZX7Pls5C7Ku8uGfugzucKMA",
})
// import type { ChatPromptTemplate } from "@langchain/core/prompts";

// Get the prompt to use - you can modify this!
// If you want to see the prompt in full, you can at:
// https://smith.langchain.com/hub/hwchase17/openai-functions-agent
const prompt = await pull(
  "hwchase17/openai-functions-agent"
);


const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});



export const agentExecutor = new AgentExecutor({
  agent,
  tools,
});


const result1 = await agentExecutor.invoke({
    input: "hi!",
  });
  
  console.log(result1);
  /*
    [chain/start] [1:chain:AgentExecutor] Entering Chain run with input: {
      "input": "hi!"
    }
    [chain/end] [1:chain:AgentExecutor] [1.36s] Exiting Chain run with output: {
      "output": "Hello! How can I assist you today?"
    }
    {
      input: 'hi!',
      output: 'Hello! How can I assist you today?'
    }
  */