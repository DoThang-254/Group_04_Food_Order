import LoginContext from "./context/LoginContext";
import ThemeContext from "./context/ThemeContext";
import Router from "./router/Router";
import "../src/theme.css"
import { GoogleOAuthProvider } from "@react-oauth/google";
function App() {
  return (
    <GoogleOAuthProvider clientId="833132880061-d2sfb94luehd05c24l37na1q4sqt9puj.apps.googleusercontent.com">

      <ThemeContext>
        <LoginContext>
          <Router />
        </LoginContext>
      </ThemeContext>
    </GoogleOAuthProvider>

  );
}

export default App;
