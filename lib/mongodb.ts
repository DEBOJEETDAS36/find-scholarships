import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Add MONGODB_URI to .env.local");
}

client = new MongoClient(uri);
clientPromise = client.connect();

export default clientPromise;
