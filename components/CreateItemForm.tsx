import { useState } from "preact/hooks"
import type { JSX } from "preact"
import { createCreateOperation, createSetOperation, isId, Operations } from "@onamea/crdt"

const CreateItemForm = () => {
	const [id, setId] = useState("")
	const [body, setBody] = useState("")

	const handleIdChange = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
		setId(event.currentTarget.value)
	}

	const handleBodyChange = (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
		setBody(event.currentTarget.value)
	}

	const handleSubmit = async (event: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>) => {
		event.preventDefault()
    if (isId(id) === false) {
      return
    }
    const createOperation = await createCreateOperation(id)
    const setOperation = body.trim() !== "" ? await createSetOperation(id, createOperation.hash, body) : undefined  
    const operations = [createOperation] as Operations
    if (setOperation) {
      operations.push(setOperation)
    }

	}

	return (
		<section>
			<form onSubmit={handleSubmit}>
				<label htmlFor="create-item-id">Id</label>
				<input id="create-item-id" type="text" value={id} onChange={handleIdChange} />

				<label htmlFor="create-item-body">Body</label>
				<textarea id="create-item-body" value={body} onChange={handleBodyChange} />
			</form>
		</section>
	)
}

export default CreateItemForm
