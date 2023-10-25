import { useEffect, useState } from "react";
import { ISuggestion } from "../../../types";

import Suggestion from "./Suggestion";

const SuggestionsList = ({
  handleSelectSuggestionEvent
}: {
  handleSelectSuggestionEvent: (suggestion: ISuggestion) => void
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([])

  const suggestNewQuotes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quote/random?_format=json');
      const data = await response.json()

      setSuggestions(response.status === 200 ? data.content : [])
    } catch (e) {
      setSuggestions([])
    }
    setLoading(false)
  }

  const handleRemoveSuggestionEvent = (text: string) => {
    setSuggestions(suggestions.filter((s: ISuggestion) => s.text !== text))
  }

  useEffect(() => {
    suggestNewQuotes()
  }, [])

  return <div className="bg-slate-200 py-6 mb-2 rounded-lg shadow">
    <div className="px-4 mb-3 mt-1">
      <h3 className="text-lg font-bold mb-1">Need some inspiration?</h3>
      {
        !loading && <p className='text-lg'>
          {suggestions.length ? 'Try with one of the following famous quotes!' : "Sorry, but we don't have suggestions today 😔" }
        </p>
      }
    </div>
    <div className="relative w-full flex gap-8 px-4 py-2 snap-x overflow-x-auto no-scrollbar">
      {suggestions.map(({ author, text }, i) => {
        const key = `suggestion__${author.replace(/ /g, '-').toLowerCase().trim()}__${i}`

        return <Suggestion
          {...{ key, author, text }}
          onSuggestionSelected={() => handleSelectSuggestionEvent({ author, text })}
          onSuggestionRemoved={(text: string) => handleRemoveSuggestionEvent(text)}
        />
      })}
    </div>
  </div>
}

export default SuggestionsList
