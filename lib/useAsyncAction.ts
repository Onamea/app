import { useRef, useState } from "preact/hooks"

export const useAsyncAction = () => {
  const [isPending, setIsPending] = useState(false)
  const isPendingRef = useRef(false)

  const execute = async <Result>(action: () => Promise<Result>): Promise<Result | undefined> => {
    if (isPendingRef.current) {
      return undefined
    }

    isPendingRef.current = true
    setIsPending(true)
    try {
      return await action()
    } finally {
      isPendingRef.current = false
      setIsPending(false)
    }
  }

  return { isPending, execute }
}
