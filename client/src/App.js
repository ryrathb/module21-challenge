import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: "/graphql",
});


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const userClient = new ApolloClient({
  link: authLink.concat(httpLink)
});

function App() {
  return (
    <ApolloProvider client={userClient}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route path="/" component={SearchBooks} />
          <Route path="/saved" element={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1> }
          />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
