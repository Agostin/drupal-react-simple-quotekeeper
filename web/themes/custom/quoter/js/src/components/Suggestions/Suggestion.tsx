import { useState } from "react"
import { ISuggestion } from "../../../types"
import { LuClipboardCopy } from 'react-icons/lu'
import { AiFillCloseCircle } from 'react-icons/ai'

const Suggestion = ({
  author,
  text,
  onSuggestionSelected
}: ISuggestion & {
  onSuggestionSelected: () => void
}) => {
  const [alreadySuggested, setAlreadySuggested] = useState<boolean>(false)
  const [hide, setHide] = useState<boolean>(false)

  const cardClassName = `relative bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-50 rounded-lg shadow-md p-4 snap-center shrink-0 w-80 ${hide ? 'hidden' : 'block'}`
  const buttonsClassName = 'text-slate-50 hover:text-slate-300 transition-colors duration-300'

  const onSuggestionSelectedHandler = () => {
    setAlreadySuggested(true);
    onSuggestionSelected()
  }

  return (
    <div className={cardClassName}>
      <div className="absolute flex items-center justify-between gap-x-1 right-3 top-4">
        {!alreadySuggested && <button type="button" className={buttonsClassName} onClick={onSuggestionSelectedHandler}>
          <LuClipboardCopy size={20} />
        </button>}
        <button type="button" className={buttonsClassName} onClick={() => setHide(true)}>
          <AiFillCloseCircle size={20} />
        </button>
      </div>
      <div className="flex flex-col justify-between w-10/12 h-full">
        <blockquote className="text-lg font-semibold mb-2">{text}</blockquote>
        <em className="text-sm text-gray-600">({author})</em>
      </div>
    </div>
  )
}

export default Suggestion
