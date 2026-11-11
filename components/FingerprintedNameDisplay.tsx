import { useEffect } from "preact/hooks"
import {
  extensionAvailable,
  getOnameaBridge,
  identityResult
} from "../lib/extensionAvailability.ts"

const FingerprintedNameDisplay = () => {
  const available = extensionAvailable.value

  useEffect(() => {
    if (available !== true) {
      identityResult.value = { status: "idle" }
      return
    }

    const onamea = getOnameaBridge()
    if (typeof onamea?.identify !== "function") {
      identityResult.value = {
        status: "error",
        message: "Could not identify this browser."
      }
      return
    }

    let active = true
    let requestId = 0

    const identify = async () => {
      const currentRequestId = ++requestId
      identityResult.value = { status: "loading" }

      try {
        const identity = await onamea.identify!()
        if (active && currentRequestId === requestId) {
          identityResult.value = { status: "identified", identity }
        }
      } catch (error) {
        if (active && currentRequestId === requestId) {
          identityResult.value = {
            status: "error",
            message:
              error instanceof Error && error.message !== ""
                ? error.message
                : "Could not identify this browser."
          }
        }
      }
    }

    globalThis.addEventListener("onamea:identity:changed", identify)
    void identify()

    return () => {
      active = false
      requestId++
      globalThis.removeEventListener("onamea:identity:changed", identify)
    }
  }, [available])

  if (available !== true) {
    return null
  }

  return (
    <p class="fingerprinted-name" role="status" aria-label="Onamea fingerprinted name">
      {identityResult.value.status === "identified"
        ? identityResult.value.identity.displayName
        : identityResult.value.status === "error"
          ? identityResult.value.message
          : "Identifying..."}
    </p>
  )
}

export default FingerprintedNameDisplay
