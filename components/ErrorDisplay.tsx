import { useState } from "preact/hooks"

type ErrorDisplayProps = {
  errors: string[]
}

export const useErrors = () => {
  const [errors, setErrors] = useState<string[]>([])

  const setError = (newErrors: string | string[]) => {
    const errorsToAdd = typeof newErrors === "string" ? [newErrors] : newErrors
    setErrors(previousErrors => [...previousErrors, ...errorsToAdd])
  }
  const clearErrors = () => setErrors([])

  return { errors, setError, clearErrors }
}

const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
  if (errors.length === 0) {
    return null
  }

  return (
    <ul class="error-display" role="alert">
      {errors.map((error, index) => (
        <li key={`${index}-${error}`}>{error}</li>
      ))}
    </ul>
  )
}

export default ErrorDisplay
