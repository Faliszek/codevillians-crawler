import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://35.234.159.89:8080/graphql",
  cache: new InMemoryCache(),
});

export const Provider = (props: any) => (
  <ApolloProvider client={client}>{props.children}</ApolloProvider>
);
