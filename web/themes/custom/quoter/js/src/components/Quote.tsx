import { IQuote } from "../../types"

const Quote = ({
  author, content, tags
}: IQuote) => (
  <>
    <p>{tags.join(',')}</p>
    <p>{content}</p>
    <small>{author}</small>
  </>
)

export default Quote
