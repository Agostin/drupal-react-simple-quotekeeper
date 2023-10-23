import { useState } from "react";
import { IQuote, ISuggestion } from "../../../types";
import Quote from "./Quote";

const QuoteSuggester = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<IQuote[]>([])
  // const [error, setError] = useState<string>('')

  const suggestQuotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/quotes/random?_format=json', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic QWdvc3Rpbm86c3BhcmtmYWJyaWs='
        }
      });
      const data = await response.json()
      console.log(data)

      if (response.status === 200) {
        setSuggestions(data.content.map((suggestion: ISuggestion) => ({
          ...suggestion,
          content: suggestion.text
        })))
      } else {
        // setError('Error')
      }
    } catch (e) {
      // setError('Error')
    }
    setIsLoading(false)
  }

  return <>
    <button onClick={suggestQuotes} className="bg-blue-500 text-white rounded-full px-4 py-2">Suggest quote</button>
    {
      isLoading ? <p>Loading...</p> :
      <ul className="mt-2">
        {suggestions.map(({ author, content }, i) => {
          const key = `suggestion__${author.replace(/ /g, '-').toLowerCase().trim()}__${i}`

          return <Quote {...{ key, author, content }}></Quote>
        })}
      </ul>
    }
  </>
}

export default QuoteSuggester
