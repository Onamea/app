import {
  isIdentityWithMessages,
  isItemWithMessages,
  type IdentityWithMessages,
  type ItemWithMessages
} from "@onamea/crdt"

export type SearchResult = IdentityWithMessages | ItemWithMessages

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.onamea.com/"

const isSearchResult = (value: unknown): value is SearchResult =>
  isIdentityWithMessages(value) || isItemWithMessages(value)

export const search = async (term: string): Promise<SearchResult[]> => {
  const normalizedTerm = term.trim()
  if (normalizedTerm === "") {
    throw new Error("Enter a name, ID, or item text to search")
  }

  const url = new URL(`search/${encodeURIComponent(normalizedTerm)}`, API_BASE_URL)
  const response = await fetch(url)

  if (response.ok === false) {
    const payload: unknown = await response.json().catch(() => undefined)
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Search failed (${response.status})`
    throw new Error(message)
  }

  const payload: unknown = await response.json()
  if (Array.isArray(payload) === false || payload.every(isSearchResult) === false) {
    throw new Error("The search service returned invalid results")
  }

  return payload
}
