import { IQuote } from "../../types";

export const callAddNewQuoteApi = async ({
  sessionToken,
  body
}: {
  sessionToken: string;
  body: IQuote
}) => {
    try {
      const response = await fetch('/api/quote/new?_format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': sessionToken
        },
        body: JSON.stringify(body)
      });

      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
}
