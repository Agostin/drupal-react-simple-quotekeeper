import { useEffect, useState } from 'react';
import { IQuote, ISuggestion } from '../../../types';
import { useSessionContext } from '../../context/SessionContext';
import { callAddNewQuoteApi } from '../../utils/functions';

import { ImSpinner3 } from 'react-icons/im'
import QuoteForm from './QuoteForm';
import Quote from './Quote'
import SuggestionsList from '../Suggestions/SuggestionsList'

const QuotesList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [quotes, setQuotes] = useState<Array<IQuote>>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Array<IQuote>>([])
  const [error, setError] = useState<string>('')

  const { sessionToken } = useSessionContext()

  const fetchStoredQuotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/quotes?_format=json', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic QWdvc3Rpbm86c3BhcmtmYWJyaWs='
        }
      });
      const data = await response.json()

      if (response.status === 200) {
        const list = typeof data.content === 'string' ? JSON.parse(data.content) : data.content
        setQuotes(list)
        setFilteredQuotes(list)
      } else {
        setError('Error')
        setQuotes([])
        setFilteredQuotes([])
      }
    } catch (e) {
      setQuotes([])
      setFilteredQuotes([])
      setError('Error')
    }
    setIsLoading(false)
  }

  const onNewNoteSubmittedHandler = (quote: IQuote): void => {
    if (!quote.content) return

    setQuotes([ quote, ...quotes ])
    setFilteredQuotes(quotes)
  }

  const handleKeyboardSearch = (evt: any) => {
    const keyword = evt.target.value

    if (keyword.length > 2) {
      const filteredQuotes = quotes.filter(
        (q: IQuote) => q.content.indexOf(keyword) !== -1 || q.author.indexOf(keyword) !== -1
      )
      setFilteredQuotes(filteredQuotes)
    } else {
      setFilteredQuotes(quotes)
    }
  }

  const addSuggestionToQuotesList = async (suggestion: ISuggestion) => {
    const suggestionToStoreAsQuote = { ...suggestion, content: suggestion.text }
    const quoteHasBeenAdded = await callAddNewQuoteApi({
      sessionToken, body: suggestionToStoreAsQuote
    })

    if (quoteHasBeenAdded) {
      setQuotes([ suggestionToStoreAsQuote,  ...quotes ])
      setFilteredQuotes(quotes)
    }
  }

  useEffect(() => {
    fetchStoredQuotes()
  }, [])

  return (
    <div className='container'>
      <div className='flex items-center flex-col justify-between gap-y-2 text-left mb-4 lg:flex-row'>
        <h1 className='text-3xl'>A cool quotes keeper 📒</h1>
        <input type="search" onChange={handleKeyboardSearch} placeholder="Search for keyword..." className='flex w-full items-center text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow rounded-lg text-slate-400 lg:w-72' />
      </div>

      <SuggestionsList handleSelectSuggestionEvent={addSuggestionToQuotesList} />
      <QuoteForm onNewNoteSubmitted={(newQuote: IQuote) => onNewNoteSubmittedHandler(newQuote)} />

      {
        isLoading ?
          <div className='flex items-center gap-x-2'>
            <ImSpinner3 size={28} className="animate-spin" />
            <p className='text-xl'>Loading quotes...</p>
          </div> :
          <>
            {
              error ||
              <>
                <h2 className="text-xl font-bold mb-2 mt-8">Your quotes list:</h2>
                <ul className='grid gap-4 grid-span-full md:grid-cols-2 lg:grid-cols-3'>
                  {filteredQuotes.map(({ author, content }, i) => {
                    const key = `quote__${author.toLowerCase().replace(/ /g, '_')}__${i}`

                    return <Quote key={key} {...{ author, content }} />
                  })}
                </ul>
              </>
            }
          </>
      }
    </div>
  )
}

export default QuotesList;
