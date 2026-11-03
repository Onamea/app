import { render } from "preact"
import FingerprintedNameDisplay from "./components/FingerprintedNameDisplay.tsx"
import ExtensionStatus from "./components/ExtensionStatus.tsx"
import SearchForm from "./components/SearchForm.tsx"
import "./assets/styles.css"

const App = () => (
  <main class="page">
    <ExtensionStatus />
    <FingerprintedNameDisplay />
    <SearchForm />
  </main>
)

render(<App />, document.getElementById("app")!)
