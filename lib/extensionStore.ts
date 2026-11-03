export type ExtensionStore = {
  name: string
  url: string
}

export const getExtensionStore = (userAgent = globalThis.navigator.userAgent): ExtensionStore | undefined => {
  const isFirefox = /Firefox\//.test(userAgent)
    && /Gecko\//.test(userAgent)
    && /\bFxiOS\//.test(userAgent) === false

  if (isFirefox) {
    return {
      name: "Firefox Add-ons",
      url: "https://addons.mozilla.org/en-US/firefox/search/?q=onamea"
    }
  }

  const isChrome = /\bChrome\//.test(userAgent)
    && /\b(Edg(?:A|iOS)?|OPR|SamsungBrowser|Brave)\//.test(userAgent) === false

  if (isChrome) {
    return {
      name: "Chrome Web Store",
      url: "https://chromewebstore.google.com/search/onamea"
    }
  }

  return undefined
}
