import { signal } from "@preact/signals"
import type { IdentityWithMessages } from "@onamea/crdt"

export type OnameaBridge = {
	namespace?: unknown
	marker?: unknown
  identify?: () => Promise<IdentityWithMessages>
	sign?: () => Promise<unknown>
}

export type IdentityResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "identified"; identity: IdentityWithMessages }
  | { status: "error"; message: string }

export const extensionAvailable = signal<boolean | undefined>(undefined)
export const identityResult = signal<IdentityResult>({ status: "idle" })

export const getOnameaBridge = () =>
	(globalThis as typeof globalThis & { Onamea?: OnameaBridge }).Onamea

export const checkIsAvailable = () => {
  const onamea = getOnameaBridge()
  const isAvailable =
      onamea?.namespace === "ONAMEA:BRIDGE" &&
      onamea?.marker === "ONAMEA_BRIDGE_V0" &&
      typeof onamea.identify === "function" &&
      typeof onamea.sign === "function"
  extensionAvailable.value = isAvailable
  return isAvailable
}
