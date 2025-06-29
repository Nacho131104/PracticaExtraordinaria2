import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { HotelModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get('MONGO_URL')

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("BaseFinal");
const HotelCollection =
  mongoDB.collection<HotelModel>("Hoteles");

const server = new ApolloServer({
  typeDefs:schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ HotelCollection }),
});

console.info(`Server ready at ${url}`);