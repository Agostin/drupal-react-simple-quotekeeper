import { useEffect, useState } from 'react';
import Quote from './Quote'
import { IQuote } from '../../types';

const QuotesList = () => {
  const [quotes, setQuotes] = useState<Array<IQuote>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchQuotesList = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/quotes_rest_api/quotes_resource');
      const data = await response.json()

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
    fetchQuotesList()
  }, [])

  return (
    <>
      <h1>Quotes List</h1>

      {
        isLoading ?
          <p>Loading...</p> :
          <>
            {
              error ||
              <ul>
                {quotes.map(({ _id, author, content, tags }) => <Quote key={_id} {...{ _id, author, content, tags }} />)}
              </ul>
            }
          </>
      }
    </>
  )
}

export default QuotesList;
