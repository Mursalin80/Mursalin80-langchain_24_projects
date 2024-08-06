import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { config } from "dotenv";

config();

export const huggingFaceEmbedding = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
});
export const googleVertexAIEmbedding = new GoogleVertexAIEmbeddings({});
