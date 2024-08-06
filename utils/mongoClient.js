import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";

config();

export const client = new MongoClient(process.env.MONGODB_LOCAL_URI || "", {
  driverInfo: { name: "langchainjs" },
});

//   await client.connect();
//   const collection = client.db("langchain").collection("memory");
