import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Check if we're in development or production
const isDevelopment = process.env.NODE_ENV === "development";
const backendUrl = isDevelopment
  ? "http://localhost:8000/graphql/"
  : "/graphql/";

const httpLink = new HttpLink({
  uri: backendUrl,
});

const errorLink = onError((errorObj: any) => {
  const { graphQLErrors, networkError } = errorObj;
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        fields: {
          taskCount: {
            read(existing) {
              return existing ?? 0;
            },
          },
          completedTasks: {
            read(existing) {
              return existing ?? 0;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default client;
