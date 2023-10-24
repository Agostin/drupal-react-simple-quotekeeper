import { IQuote } from "../../../types"
import { BiCopy, BiTrash } from 'react-icons/bi'

const Quote = ({
  author,
  content,
  className
}: IQuote & { className?: string }) => {
  const copyOnClipboard = async () => {
    // there are better ways to handle this...
    navigator.clipboard.writeText(`${content}\n(${author})`)
      .then(() => alert('Quote copied in the clipboard!'))
  }
  const deleteNote = () => {

  }

  const buttonsClassName = 'text-slate-700 hover:text-slate-900 transition-colors duration-300'

  return (
    <div className={`relative bg-white rounded-lg shadow-md p-4 border border-slate-300 ${className}`}>
      <div className="absolute flex items-center justify-between gap-x-1 right-3 top-4">
        <button type="button" className={buttonsClassName} onClick={copyOnClipboard}>
          <BiCopy size={20} />
        </button>
        <button type="button" className={buttonsClassName} onClick={deleteNote}>
          <BiTrash size={20} className="fill-red-500 hover:fill-red-700" />
        </button>
      </div>
      <div className="flex flex-col justify-between w-10/12 h-full">
        <blockquote className="text-lg font-semibold mb-2">{content}</blockquote>
        <em className="text-sm text-gray-600">({author})</em>
      </div>
    </div>
  )
}

export default Quote
