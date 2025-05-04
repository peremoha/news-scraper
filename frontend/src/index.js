import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // Стилі
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Налаштування Apollo Client
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL, // URL із .env
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);