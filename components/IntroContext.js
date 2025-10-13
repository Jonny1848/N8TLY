// components/IntroContext.js
import { createContext, useContext, useState } from 'react';

const IntroContext = createContext({
  introCompleted: false,
  setIntroCompleted: () => {},
});

export function IntroProvider({ children }) {
  const [introCompleted, setIntroCompleted] = useState(false);
  return (
    <IntroContext.Provider value={{ introCompleted, setIntroCompleted }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
