import React, { useEffect, useState } from 'react';
import Quote from './Quote'

const QuotesList = () => {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchQuotesList = async () => {
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
                {quotes.map(({ _id: key, author, content, tags }) => <Quote {...{ author, content, key, tags }} />)}
              </ul>
            }
          </>
      }
    </>
  )
}

export default QuotesList;
