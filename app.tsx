import { render } from "preact"
import FingerprintedNameDisplay from "./components/FingerprintedNameDisplay.tsx"
import ExtensionStatus from "./components/ExtensionStatus.tsx"
import SearchForm from "./components/SearchForm.tsx"
import "./assets/styles.css"
import CreateItemForm from "./components/CreateItemForm.tsx"
import { identityResult } from "./lib/extensionAvailability.ts"

const App = () => (
  <main class="page">
    <ExtensionStatus />
    <FingerprintedNameDisplay />
    <SearchForm />
    { identityResult.value.status === "identified" &&
      <CreateItemForm />
    }
  </main>
)

render(<App />, document.getElementById("app")!)
