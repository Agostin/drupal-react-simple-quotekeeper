import { useState } from 'react';

const QuoteForm = () => {
  const [newQuote, setNewQuote] = useState({
    content: '',
    author: ''
  });

  const handleChange = (evt: any, field: 'author' | 'content') => {
    const value = evt.target.value
    setNewQuote({
      ...newQuote,
      [field]: value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setNewQuote({
      content: '',
      author: ''
    });

    // Store new quote on MySQL db
    // Update UI list live
  };

  return (
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
  );
};

export default QuoteForm;
