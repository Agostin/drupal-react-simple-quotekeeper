import { useState } from 'react';
import { IQuote } from '../../../types';
import { useSessionContext } from '../../context/SessionContext';

import { ImSpinner3 } from 'react-icons/im';
import { callAddNewQuoteApi } from '../../utils/functions';

const QuoteForm = ({
  onNewNoteSubmitted
}: {
  onNewNoteSubmitted: (quote: IQuote) => void
}) => {
  const [newQuote, setNewQuote] = useState({
    content: '',
    author: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { sessionToken } = useSessionContext()

  const handleChange = (evt: any, field: 'author' | 'content') => {
    const value = evt.target.value
    setNewQuote({
      ...newQuote,
      [field]: value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)

    const quoteHasBeenAdded = await callAddNewQuoteApi({ sessionToken, body: newQuote })
    if (quoteHasBeenAdded) {
      // note: the best approach would be to lift-up the response stored on DB instead of the input data
      onNewNoteSubmitted(newQuote)
      // reset quote form
      setNewQuote({
        content: '',
        author: ''
      });
    } else {
      setError('Error')
    }

    setIsLoading(false)
  };

  return (
    <>
      {error && <p className='mb-3 text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 my-5">
        <h3 className="text-lg font-bold mb-1">Add a new quote</h3>
        <div className="mb-4">
          <textarea
            id="content"
            name="content"
            placeholder="Type the Quote's content here"
            value={newQuote.content}
            onChange={() => handleChange(event, 'content')}
            className="w-full px-3 py-2 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg resize-none min-h-[6rem]"
            required
          />
        </div>
        <div className="mb-4">
          <input
            id="author"
            name="author"
            type="text"
            placeholder="Type the Quote's author"
            value={newQuote.author}
            onChange={() => handleChange(event, 'author')}
            className="w-full h-12 p-4 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg"
            required
          />
        </div>
        <button type="submit" className={`inline-flex gap-x-2 items-center px-4 py-2 font-semibold leading-6 text-md shadow rounded-md text-white bg-green-500 hover:bg-green-400 transition ease-in-out duration-150 ${isLoading ? 'cursor-not-allowed' : ''}`} disabled={isLoading}>
          {isLoading && <ImSpinner3 size={20} className="animate-spin" />}
          Add Quote
        </button>
      </form>
    </>
  );
};

export default QuoteForm;
