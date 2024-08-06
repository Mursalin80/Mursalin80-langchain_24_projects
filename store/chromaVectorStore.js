import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "cheerio";
import { ChromaClient } from "chromadb";
import { huggingFaceEmbedding } from "../embdding/embdding.js";

let vectorStore,
  client,
  collection = null;

export const upLoadDocToVectorStore = async () => {
  let docUrl = "https://lilianweng.github.io/posts/2023-06-23-agent/";
  const loader = new CheerioWebBaseLoader(docUrl);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);

  try {
    client = new ChromaClient();
    await client.deleteCollection({ name: "chroma_db" });
    collection = await client.createCollection({ name: "chroma_db" });

    // collection.count().then((count) => {
    //   console.log({ count });
    // });
  } catch (error) {
    console.log({ error });
  }

  vectorStore = new Chroma(huggingFaceEmbedding, {
    collectionName: "chroma_db",

    url: "http://localhost:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    },
    // Optional, can be used to specify the distance method of the embedding space
    //  https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });

  await vectorStore.addDocuments(splits);
  console.log("Documents uploaded to vector store successful!!!");
  collection.count().then((count) => {
    console.log({ count });
  });
};

export const getVectorStore = async () => {
  if (!vectorStore) {
    await upLoadDocToVectorStore();
  }
  return vectorStore.asRetriever({ k: 2 });
};
