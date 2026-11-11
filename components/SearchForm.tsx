import { useState } from "preact/hooks"
import type { TargetedEvent } from "preact"
import ErrorDisplay, { useErrors } from "./ErrorDisplay.tsx"
import SearchResults from "./SearchResults.tsx"
import { search, type SearchResult } from "../lib/search.ts"

const SearchForm = () => {
  const [term, setTerm] = useState("")
  const [submittedTerm, setSubmittedTerm] = useState("")
  const [results, setResults] = useState<SearchResult[] | undefined>()
  const { errors, setError, clearErrors } = useErrors()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: TargetedEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    clearErrors()
    setResults(undefined)

    try {
      setLoading(true)
      const nextResults = await search(term)
      setSubmittedTerm(term.trim())
      setResults(nextResults)
    } catch (error) {
      setSubmittedTerm(term.trim())
      setError(error instanceof Error ? error.message : "Search could not be completed")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event: TargetedEvent<HTMLInputElement, Event>) => {
    setTerm(event.currentTarget.value)
    setSubmittedTerm("")
    setResults(undefined)
    clearErrors()
  }

  return (
    <section class="search-section" aria-label="Search Onamea">
      <form class="search-form" onSubmit={handleSubmit} role="search">
        <div class="search-controls">
          <input
            id="search-term"
            name="term"
            type="search"
            autoComplete="off"
            aria-label="Name, Id, or Body text"
            placeholder="Name, Id, or Body text"
            value={term}
            onInput={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {loading && (
        <p class="search-message" role="status">
          Searching Onamea...
        </p>
      )}
      <ErrorDisplay errors={errors} />
      {results && results.length === 0 && (
        <p class="search-message" role="status">
          No results for "{submittedTerm}"
        </p>
      )}
      {results && results.length > 0 && (
        <section class="results-section" aria-label={`Results for ${submittedTerm}`}>
          <div class="results-heading">
            <h2>Results</h2>
            <span>{results.length}</span>
          </div>
          <SearchResults results={results} />
        </section>
      )}
    </section>
  )
}

export default SearchForm
