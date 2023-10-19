import { IQuote } from "../../types"

const Quote = ({ author, text }: IQuote) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <blockquote className="text-lg font-semibold mb-2">{text}</blockquote>
      <em className="text-sm text-gray-600">{author}</em>
    </div>
  )
}

export default Quote
