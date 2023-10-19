import { useEffect, useState } from 'react';
import { IQuote } from '../../types';

import Quote from './Quote'

const QuotesList = () => {
  const [quotes, setQuotes] = useState<Array<IQuote>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const suggestQuote = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/quotes_rest_api/quotes_resource');
      const data = await response.json()
      console.log(data)

      if (response.status === 200) {
        setQuotes(data.content)
      } else {
        setError('Error')
      }
    } catch (e) {
      setError('Error')
    }
    setIsLoading(false)
  }

  const fetchStoredQuotes = async () => {
    // Fetch quotes from MySQL database
  }

  useEffect(() => {
    fetchStoredQuotes()
  }, [])

  return (
    <>
      <h1 className='text-3xl mb-4'>Quotes List</h1>

      {
        isLoading ?
          <p>Loading...</p> :
          <>
            {
              error ||
              <>
                <button onClick={suggestQuote} className="bg-blue-500 text-white rounded-full px-4 py-2">Suggest quote</button>
                <ul className='grid gap-4 grid-span-full md:grid-cols-2 lg:grid-cols-3'>
                  {quotes.map(({ author, text }, i) => {
                    const key = `quote__${author.toLowerCase().replace(/ /g, '_')}__${i}`
                    return <Quote key={key} {...{ author, text }} />
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
