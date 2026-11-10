import { isIdentityWithMessages } from "@onamea/crdt"
import type { SearchResult } from "../lib/search.ts"

type SearchResultsProps = {
  results: SearchResult[]
}

const SearchResults = ({ results }: SearchResultsProps) => (
  <ul class="result-list">
    {results.map(result => {
      const kind = isIdentityWithMessages(result) ? "Identity" : "Item"

      return (
        <li class="result-row" key={result.id}>
          <div class="result-main">
            <span class="result-kind">{kind}</span>
            <h2>{result.displayName ?? result.id}</h2>
            {result.body && <p class="result-body">{result.body}</p>}
          </div>
          {result.tombstone && <span class="result-status">Deleted</span>}
        </li>
      )
    })}
  </ul>
)

export default SearchResults
