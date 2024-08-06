import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { ObjectId } from "mongodb";

import { client } from "../utils/mongoClient.js";

await client.connect();
const collection = client.db("langchain").collection("memory");

// generate a new sessionId string
const sessionId = new ObjectId().toString();

export const memory = new BufferMemory({
  chatHistory: new MongoDBChatMessageHistory({
    collection,
    sessionId,
  }),
});
