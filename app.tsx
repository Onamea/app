import { render } from "preact"
import SearchForm from "./components/SearchForm.tsx"
import "./assets/styles.css"

const App = () => (
  <main class="page">
    <SearchForm />
  </main>
)

render(<App />, document.getElementById("app")!)
