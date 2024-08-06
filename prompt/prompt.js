import {
  PromptTemplate,
  MessagesPlaceholder,
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import { pull } from "langchain/hub";

const rag_template = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.

{context}

Question: {question}

Helpful Answer:`;

export const prompt_rag = PromptTemplate.fromTemplate(rag_template);

export const prompt_conversational = await pull("rlm/rag-prompt");

const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

export const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);
