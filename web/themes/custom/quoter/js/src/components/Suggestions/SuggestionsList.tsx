import { useEffect, useState } from "react";
import { ISuggestion } from "../../../types";

import Suggestion from "./Suggestion";

const SuggestionsList = ({
  handleSelectSuggestionEvent
}: {
  handleSelectSuggestionEvent: (suggestion: ISuggestion) => void
}) => {
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([])

  const suggestNewQuotes = async () => {
    try {
      const response = await fetch('/api/quote/random?_format=json');
      const data = await response.json()

      setSuggestions(response.status === 200 ? data.content : [])
    } catch (e) {
      setSuggestions([])
    }
  }

  useEffect(() => {
    suggestNewQuotes()
  }, [])

  return <div className="bg-slate-200 py-8 mb-2 rounded-lg shadow">
    <div className="px-4 mb-3 mt-1">
      <h3 className="text-lg font-bold mb-1">Need some inspiration?</h3>
      <p>Try with one of the following famous quotes!</p>
    </div>
    <div className="relative w-full flex gap-8 px-4 snap-x overflow-x-auto no-scrollbar">
      {suggestions.map(({ author, text }, i) => {
        const key = `suggestion__${author.replace(/ /g, '-').toLowerCase().trim()}__${i}`

        return <Suggestion {...{ key, author, text }} onSuggestionSelected={() => handleSelectSuggestionEvent({ author, text })} />
      })}
    </div>
  </div>
}

export default SuggestionsList
