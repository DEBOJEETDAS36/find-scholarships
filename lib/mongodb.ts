// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI!;
// const options = {};

// let client;
// let clientPromise: Promise<MongoClient>;

// if (!process.env.MONGODB_URI) {
//   throw new Error("Add MONGODB_URI to .env.local");
// }

// client = new MongoClient(uri);
// clientPromise = client.connect();

// export default clientPromise;

import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const uri = process.env.MONGODB_URI!;

let client;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
