import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

interface SessionContextProviderProps {
  sessionToken: string
}

export const SessionContext = createContext<SessionContextProviderProps | undefined>(undefined);

export const SessionContextProvider: React.FunctionComponent<PropsWithChildren> = ({
  children
}) => {
  const [sessionToken, setSessionToken] = useState('')

  const SESSION_TOKEN_KEY_LS = '__st'

  const fetchSessionToken = async () => {
    const storedSessionToken = localStorage.getItem(SESSION_TOKEN_KEY_LS)
    if (storedSessionToken !== null) {
      setSessionToken(atob(storedSessionToken))
    } else {
      const response = await fetch('/session/token')
      const token = await response.text()

      if (response.status === 200) {
        localStorage.setItem(SESSION_TOKEN_KEY_LS, btoa(token))
        setSessionToken(token)
      }
    }
  }

  useEffect(() => {
    fetchSessionToken()
  }, [])

  const value = useMemo(
    () => ({
      sessionToken
    }),
    [sessionToken]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error(
      'useSessionContext must be used within a SessionContextProvider',
    );
  }

  return context;
}
