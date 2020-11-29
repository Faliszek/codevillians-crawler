import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://follow-the-river-api.codevillains.com/graphql",
  cache: new InMemoryCache(),
});

export const Provider = (props: any) => (
  <ApolloProvider client={client}>{props.children}</ApolloProvider>
);
