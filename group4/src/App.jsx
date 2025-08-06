import LoginContext from "./context/LoginContext";
import ThemeContext from "./context/ThemeContext";
import Router from "./router/Router";
import "../src/theme.css"
function App() {
  return (
    <ThemeContext>
      <LoginContext>
        <Router />
      </LoginContext>
    </ThemeContext>
  );
}

export default App;
