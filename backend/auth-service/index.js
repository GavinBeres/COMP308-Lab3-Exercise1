require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`Auth service running at http://localhost:${PORT}/graphql`);
  });
};

startServer();