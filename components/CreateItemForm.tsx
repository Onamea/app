import { useState } from "preact/hooks"
import type { TargetedEvent } from "preact"
import { createCreateOperation, createSetOperation, isId, isItem, isMessage } from "@onamea/crdt"
import type { Operations } from "@onamea/crdt"
import ErrorDisplay, { useErrors } from "./ErrorDisplay.tsx"
import { getOnameaBridge } from "../lib/extensionAvailability.ts"
import { useAsyncAction } from "../lib/useAsyncAction.ts"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.onamea.com/"

const CreateItemForm = () => {
  const [id, setId] = useState("")
  const [body, setBody] = useState("")
  const [savedItem, setSavedItem] = useState<{ id: string; body: string }>()
  const { isPending: submitting, execute } = useAsyncAction()
  const { errors, setError, clearErrors } = useErrors()

  const handleIdChange = (event: TargetedEvent<HTMLInputElement, Event>) => {
    setId(event.currentTarget.value)
    setSavedItem(undefined)
    clearErrors()
  }

  const handleBodyChange = (event: TargetedEvent<HTMLTextAreaElement, Event>) => {
    setBody(event.currentTarget.value)
    setSavedItem(undefined)
    clearErrors()
  }

  const handleSubmit = async (event: TargetedEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    await execute(async () => {
      clearErrors()
      if (isId(id) === false) {
        setError("Enter a valid ID.")
        return
      }
      setSavedItem(undefined)
      try {
        const createOperation = await createCreateOperation(id)
        const setOperation =
          body.trim() !== "" ? await createSetOperation(id, createOperation.hash, body) : undefined
        const operations = [createOperation] as Operations
        if (setOperation) {
          operations.push(setOperation)
        }
        const onamea = getOnameaBridge()
        if (typeof onamea?.sign !== "function") {
          setError("Onamea extension is not available.")
          return
        }
        const { signedMessages } = await onamea.sign(operations)
        if (Array.isArray(signedMessages) === false || signedMessages.every(isMessage) === false) {
          throw new Error("Onamea extension returned invalid signed messages.")
        }
        if (signedMessages.length !== operations.length) {
          throw new Error(
            `Onamea extension returned ${signedMessages.length} signed messages for ${operations.length} operations.`
          )
        }
        const response = await fetch(new URL("/", API_BASE_URL), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signedMessages)
        })
        if (response.ok === false) {
          const payload: unknown = await response.json().catch(() => undefined)
          const errorMessage =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
              ? payload.error
              : response.statusText || response.status
          throw new Error(`Publish failed: ${errorMessage}`)
        }
        const payload: unknown = await response.json()
        if (Array.isArray(payload) === false) {
          throw new Error("The API returned invalid saved item data.")
        }
        const savedItems = payload.filter(isItem)
        if (savedItems.length !== payload.length) {
          throw new Error("The API returned invalid saved item data.")
        }
        const savedItem = savedItems.find(item => item.id === id)
        if (savedItem === undefined) {
          throw new Error("The API response did not include the saved item.")
        }
        setSavedItem({ id: savedItem.id, body: savedItem.body ?? "" })
        setId("")
        setBody("")
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" &&
                error !== null &&
                "message" in error &&
                typeof error.message === "string"
              ? error.message
              : "Item could not be created."
        setError(errorMessage)
      }
    })
  }

  return (
    <section class="create-item-section">
      <h2>Create Item</h2>
      <form class="create-item-form" onSubmit={handleSubmit}>
        <div class="create-item-field">
          <label htmlFor="create-item-id">Id</label>
          <input
            id="create-item-id"
            type="text"
            value={id}
            onChange={handleIdChange}
            disabled={submitting}
          />
        </div>

        <div class="create-item-field">
          <label htmlFor="create-item-body">Body</label>
          <textarea
            id="create-item-body"
            value={body}
            onChange={handleBodyChange}
            disabled={submitting}
          />
        </div>

        <ErrorDisplay errors={errors} />

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Item"}
        </button>
      </form>
      {savedItem && (
        <div class="create-item-success" role="status">
          <p>Item saved</p>
          <dl>
            <div>
              <dt>Id</dt>
              <dd>{savedItem.id}</dd>
            </div>
            <div>
              <dt>Body</dt>
              <dd>{savedItem.body || "Empty"}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  )
}

export default CreateItemForm
