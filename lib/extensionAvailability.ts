import { signal } from "@preact/signals"
import type { IdentityWithMessages, Message, Operation } from "@onamea/crdt"

export type OnameaAPI = {
  readonly namespace: "ONAMEA:BRIDGE"
  readonly marker: "ONAMEA_BRIDGE_V0"
  readonly version: "1"
  identify(): Promise<IdentityWithMessages>
  sign(data: Operation | Operation[]): Promise<{ signedMessages: Message[] }>
}

export type IdentityResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "identified"; identity: IdentityWithMessages }
  | { status: "error"; message: string }

export const extensionAvailable = signal<boolean | undefined>(undefined)
export const identityResult = signal<IdentityResult>({ status: "idle" })

export const getOnameaBridge = () =>
	(globalThis as typeof globalThis & { Onamea?: OnameaAPI }).Onamea

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
