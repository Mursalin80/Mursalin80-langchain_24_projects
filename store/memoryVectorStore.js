import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import "cheerio";

import {
  googleVertexAIEmbedding,
  huggingFaceEmbedding,
} from "../embdding/embdding.js";

let vectorStore = null;
export const upLoadDocToVectorStore = async () => {
  let docUrl = "https://lilianweng.github.io/posts/2023-06-23-agent/";
  const loader = new CheerioWebBaseLoader(docUrl);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);

  vectorStore = new MemoryVectorStore(huggingFaceEmbedding);
  await vectorStore.addDocuments(splits);
  console.log("Documents uploaded to vector store successful!!!");
};

export const getVectorStore = async () => {
  if (!vectorStore) {
    await upLoadDocToVectorStore();
  }
  return vectorStore.asRetriever();
};
