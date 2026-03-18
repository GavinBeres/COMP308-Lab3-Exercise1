import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import AuthApp from "./components/AuthApp";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4001/graphql",
  }),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthApp />
    </ApolloProvider>
  );
}

export default App;