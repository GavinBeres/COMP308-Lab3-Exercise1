import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import CommunityApp from "./components/CommunityApp";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4002/graphql",
  }),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <CommunityApp />
    </ApolloProvider>
  );
}

export default App;