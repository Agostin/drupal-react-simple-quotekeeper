export interface IQuote {
  _id: string
  author: string
  authorSlug?: string
  content: string
  length?: number
  tags: Array<string>
}
