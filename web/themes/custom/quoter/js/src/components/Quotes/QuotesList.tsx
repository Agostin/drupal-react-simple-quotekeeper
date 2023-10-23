import { useEffect, useState } from 'react';
import { IQuote } from '../../../types';

import QuoteForm from './QuoteForm';
import Quote from './Quote'

const QuotesList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [quotes, setQuotes] = useState<Array<IQuote>>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Array<IQuote>>([])
  const [error, setError] = useState<string>('')

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

  useEffect(() => {
    fetchStoredQuotes()
  }, [])

  return (
    <div className='container'>
      <div className='flex items-center flex-col justify-between lg:flex-row'>
        <h1 className='text-3xl mb-4'>A cool quotes keeper</h1>
        <input type="search" onChange={handleKeyboardSearch} placeholder="Search for keyword..." className='hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400' />
      </div>

      <QuoteForm onNewNoteSubmitted={(newQuote: IQuote) => onNewNoteSubmittedHandler(newQuote)} />

      {
        isLoading ?
          <p>Loading...</p> :
          <>
            {
              error ||
              <>

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
