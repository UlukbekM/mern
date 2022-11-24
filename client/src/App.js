import './App.css';
import { Home } from './Components/Home'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleID = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}`
  return (
    <GoogleOAuthProvider clientId={googleID}>
        <Home/>
    </GoogleOAuthProvider>
  );
}

export default App;
