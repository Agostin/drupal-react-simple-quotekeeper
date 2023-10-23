import { IQuote } from "../../../types"

const Quote = ({
  author,
  content
}: IQuote) => {
  const copyOnClipboard = async () => {
    navigator.clipboard.writeText(`${content}\n(${author})`)
      .then(() => alert('Copied!'))
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4">
      <div className="absolute flex items-center justify-between right-3 top-3">
        <button type="button" className="text-slate-500 hover:text-slate-400" onClick={copyOnClipboard}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path><path d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path></svg>
        </button>
      </div>
      <div className="w-11/12">
        <blockquote className="text-lg font-semibold mb-2">{content}</blockquote>
        <em className="text-sm text-gray-600">({author})</em>
      </div>
    </div>
  )
}

export default Quote
