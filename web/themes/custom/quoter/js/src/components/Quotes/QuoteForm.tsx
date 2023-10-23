import { useEffect, useState } from 'react';
import { IQuote } from '../../../types';
import LoadingIcon from '../LoadingIcon';

const QuoteForm = ({
  onNewNoteSubmitted
}: {
  onNewNoteSubmitted: (quote: IQuote) => void
}) => {
  const [sessionToken, setSessionToken] = useState<string>('')
  const [newQuote, setNewQuote] = useState({
    content: '',
    author: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleChange = (evt: any, field: 'author' | 'content') => {
    const value = evt.target.value
    setNewQuote({
      ...newQuote,
      [field]: value
    })
  }

  const fetchSessionToken = async () => {
    const response = await fetch('/session/token')
    const token = await response.text()

    if (response.status === 200) {
      setSessionToken(token)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true)
    try {
      const response = await fetch('/api/quote/new?_format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic QWdvc3Rpbm86c3BhcmtmYWJyaWs=',
          'X-CSRF-Token': sessionToken
        },
        body: JSON.stringify(newQuote)
      });
      // note: the best approach would be to lift-up the response stored on DB instead of the input data
      onNewNoteSubmitted(newQuote)

      if (response.status === 200) {
        setNewQuote({
          content: '',
          author: ''
        });
      } else {
        setError('Error')
      }
    } catch (e) {
      setError('Error')
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (!sessionToken) {
      fetchSessionToken()
    }
  }, [])

  return (
    <>
      {error && <p className='mb-3 text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 my-4">
        <div className="mb-4">
          <label htmlFor="content" className="block text-lg font-semibold mb-2">Content</label>
          <textarea
            id="content"
            name="content"
            value={newQuote.content}
            onChange={() => handleChange(event, 'content')}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-lg font-semibold mb-2">Author</label>
          <input
            id="author"
            name="author"
            type="text"
            value={newQuote.author}
            onChange={() => handleChange(event, 'author')}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className={`inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 ${isLoading ? 'cursor-not-allowed' : ''}`} disabled={isLoading}>
          {isLoading && <LoadingIcon />}
          Add Quote
        </button>
      </form>
    </>
  );
};

export default QuoteForm;
