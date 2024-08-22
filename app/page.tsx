import SessionProviderWrapper from './components/SessionProviderWrapper';
import Home from './components/Home';

const App = () => {
  return (
    <SessionProviderWrapper>
      <Home />
    </SessionProviderWrapper>
  );
}

export default App;
