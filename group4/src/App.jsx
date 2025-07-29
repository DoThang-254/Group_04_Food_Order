import LoginContext from "./context/LoginContext"
import Router from "./router/Router"

function App() {

  return (
    <>
      <LoginContext>
        <Router />
      </LoginContext>
    </>
  )
}

export default App
