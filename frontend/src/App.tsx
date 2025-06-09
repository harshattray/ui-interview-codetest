import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import Dashboard from './components/Dashboard';
import theme from './theme';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
