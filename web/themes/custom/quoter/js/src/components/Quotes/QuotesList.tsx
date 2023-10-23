import { useEffect, useState } from 'react';
import { IQuote } from '../../../types';

import QuoteForm from './QuoteForm';
import Quote from './Quote'

const QuotesList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [quotes, setQuotes] = useState<Array<IQuote>>([])
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
        setQuotes(typeof data.content === 'string' ? JSON.parse(data.content) : data.content)
      } else {
        setError('Error')
      }
    } catch (e) {
      setError('Error')
    }
    setIsLoading(false)
  }

  const onNewNoteSubmittedHandler = (quote: IQuote): void => {
    if (!quote.content) return

    setQuotes([ quote, ...quotes ])
  }

  useEffect(() => {
    fetchStoredQuotes()
  }, [])

  return (
    <>
      <h1 className='text-3xl mb-4'>Quotes List</h1>
      <QuoteForm onNewNoteSubmitted={(newQuote: IQuote) => onNewNoteSubmittedHandler(newQuote)} />
      {
        isLoading ?
          <p>Loading...</p> :
          <>
            {
              error ||
              <>
                <ul className='grid gap-4 grid-span-full md:grid-cols-2 lg:grid-cols-3'>
                  {quotes.map(({ author, content }, i) => {
                    const key = `quote__${author.toLowerCase().replace(/ /g, '_')}__${i}`

                    return <Quote key={key} {...{ author, content }} />
                  })}
                </ul>
              </>
            }
          </>
      }
    </>
  )
}

export default QuotesList;
