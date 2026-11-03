import { useEffect } from "preact/hooks"
import { extensionAvailable, checkIsAvailable } from "../lib/extensionAvailability.ts"
import { getExtensionStore } from "../lib/extensionStore.ts"

const ExtensionStatus = () => {
  const extensionStore = getExtensionStore()

  useEffect(() => {
    const handleBridgeReady = () => {
      checkIsAvailable()
    }

    globalThis.addEventListener("onamea:bridge:ready", handleBridgeReady)
    if (checkIsAvailable() === false) {
      globalThis.dispatchEvent(new Event("onamea:bridge:request"))
    }

    return () => {
      globalThis.removeEventListener("onamea:bridge:ready", handleBridgeReady)
    }
  }, [])

  return (
    <div class="extension-status" aria-live="polite">
      <p class="extension-status-message" role="status">
        {extensionAvailable.value === undefined
          ? "Checking for the Onamea extension..."
          : extensionAvailable.value
            ? "Onamea extension detected."
            : "Onamea extension not found."}
      </p>
      {extensionAvailable.value === false && extensionStore && (
        <a class="extension-status-link" href={extensionStore.url} target="_blank" rel="noreferrer">
          Get it from the {extensionStore.name}
        </a>
      )}
    </div>
  )
}

export default ExtensionStatus
