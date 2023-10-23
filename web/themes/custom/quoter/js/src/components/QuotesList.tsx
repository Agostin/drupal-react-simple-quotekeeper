import { useEffect, useState } from 'react';
import { IQuote } from '../../types';

import Quote from './Quote'

const QuotesList = () => {
  const [sessionToken, setSessionToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [quotes, setQuotes] = useState<Array<IQuote>>([])
  const [error, setError] = useState<string>('')

  const retrieveSessionToken = async () => {
    try {
      const response = await fetch('/session/token')
      const token = await response.text()

      if (response.status === 200 && token) {
        setSessionToken(token)
      }
    } catch (e) {
      setError('Error')
    }
  }

  const fetchStoredQuotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/quotes_rest_api/demo_resource?_format=json', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': sessionToken,
          'Authorization': 'Basic QWdvc3Rpbm86c3BhcmtmYWJyaWs='
        }
      });
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

  const suggestQuotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/quotes/random?_format=json', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': sessionToken
        }
      });
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

  useEffect(() => {
    if (!sessionToken) {
      retrieveSessionToken()
    }
  }, [])

  useEffect(() => {
    if (sessionToken) {
      fetchStoredQuotes()
    }
  }, [sessionToken])

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
                <button onClick={suggestQuotes} className="bg-blue-500 text-white rounded-full px-4 py-2">Suggest quote</button>
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
