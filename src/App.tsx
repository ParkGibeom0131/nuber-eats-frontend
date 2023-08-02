import React from "react";
import { LoggedOutRouter } from "./routers/logged-out-router";
import { useReactiveVar } from "@apollo/client";
import { LoggedInRouter } from "./routers/logged-in-router";
import { isLoggedInVar } from "./apollo";

// GraphQL Query
// const IS_LOGGED_IN = gql`
//   query isLoggedIn {
//     isLoggedIn @client
//   }
// `;

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
