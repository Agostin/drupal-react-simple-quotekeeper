import React from "react"

const Quote = ({
  author, content, tags
}) => (
  <>
    <p>{tags.join(',')}</p>
    <p>{content}</p>
    <small>{author}</small>
  </>
)

export default Quote
