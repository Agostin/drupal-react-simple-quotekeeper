import { useEffect, useState } from 'react';

const QuoteForm = () => {
  const [sessionToken, setSessionToken] = useState<string>('')
  const [newQuote, setNewQuote] = useState({
    content: '',
    author: ''
  });
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
      const data = await response.json()
      console.log(data)

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
        <button type="submit" className="bg-blue-500 text-white rounded-full px-4 py-2">Add Quote</button>
      </form>
    </>
  );
};

export default QuoteForm;
