import { afterEach, describe, expect, it, vi } from "vitest"
import { search } from "./search.ts"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("search", () => {
  it("rejects blank terms without making a request", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    await expect(search("   ")).rejects.toThrow("Enter a name, ID, or item text to search")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("trims and encodes the term in the API URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    await search("  Ada / Lovelace  ")

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/search/Ada%20%2F%20Lovelace"
      })
    )
  })

  it("surfaces API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Search unavailable" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      )
    )

    await expect(search("Ada")).rejects.toThrow("Search unavailable")
  })

  it("rejects malformed result data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [] }))))

    await expect(search("Ada")).rejects.toThrow("The search service returned invalid results")
  })
})
