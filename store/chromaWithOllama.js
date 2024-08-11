import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { huggingFaceEmbedding } from "../embdding/embdding.js";
import "cheerio";
import { ChromaClient } from "chromadb";

let vectorStore;

const embeddings = new OllamaEmbeddings({ model: "all-minilm" });

export const upLoadDocToVectorStore = async () => {
  let docUrl = "https://lilianweng.github.io/posts/2023-06-23-agent/",
    client,
    collectionName = "ollama",
    collection;
  const loader = new CheerioWebBaseLoader(docUrl);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  vectorStore = new Chroma(embeddings, {
    collectionName,
    url: "http://localhost:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    },
    // Optional, can be used to specify the distance method of the embedding space
    //  https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });
  client = new ChromaClient();

  try {
    // await client.deleteCollection({ name: collectionName });
    collection = await client.getOrCreateCollection({ name: collectionName });
    let count = await collection.count();
    // console.log("🚀 ~ upLoadDocToVectorStore ~ count:", count);

    if (count <= 0) {
      await vectorStore.addDocuments(splits);
      console.log("Documents uploaded to vector store successful!!!");
    }
  } catch (error) {
    console.log({ error });
  }
};

export const getVectorStore = async () => {
  if (!vectorStore) {
    await upLoadDocToVectorStore();
  }
  return vectorStore.asRetriever({ k: 3 });
};

// try {
//   await getVectorStore();
//   const question = "What are the approaches to Task Decomposition?";

//   const docs = await vectorStore.similaritySearch(question);
//   console.log(docs.length);
// } catch (error) {
//   console.log({ error });
// }
