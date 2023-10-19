import { useState } from 'react';

const QuoteForm = () => {
  const [newQuote, setNewQuote] = useState({
    content: '',
    author: '',
    tags: [],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setNewQuote({
      ...newQuote,
      [name]: name === 'tags' ? value.split(',').map((tag: string) => tag) : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setNewQuote({
      content: '',
      author: '',
      tags: [],
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
          onChange={handleChange}
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
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="block text-lg font-semibold mb-2">Tags (comma-separated)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={newQuote.tags.join(',')}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white rounded-full px-4 py-2">Add Quote</button>
    </form>
  );
};

export default QuoteForm;
