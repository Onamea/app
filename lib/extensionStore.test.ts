import { describe, expect, it } from "vitest"
import { getExtensionStore } from "./extensionStore.ts"

describe("getExtensionStore", () => {
  it("returns the Firefox Add-ons search page for Firefox", () => {
    expect(getExtensionStore("Mozilla/5.0 Gecko/20100101 Firefox/130.0")).toEqual({
      name: "Firefox Add-ons",
      url: "https://addons.mozilla.org/en-US/firefox/search/?q=onamea"
    })
  })

  it("returns the Chrome Web Store search page for Chrome", () => {
    expect(
      getExtensionStore("Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36")
    ).toEqual({
      name: "Chrome Web Store",
      url: "https://chromewebstore.google.com/search/onamea"
    })
  })

  it("does not treat Chromium browsers or unsupported browsers as Chrome", () => {
    expect(getExtensionStore("Mozilla/5.0 Chrome/130.0.0.0 Edg/130.0.0.0")).toBeUndefined()
    expect(getExtensionStore("Mozilla/5.0 Chrome/130.0.0.0 EdgA/130.0.0.0")).toBeUndefined()
    expect(getExtensionStore("Mozilla/5.0 Safari/605.1.15")).toBeUndefined()
  })
})
