import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserCreateState {
  tookie_id: string;
  name: string;
  password1: string;
  password2: string;
  email: string;
  phone_number: string;
  birth: string;
  gender: string;
  investment_level: number;
}

interface InvestmentPreferenceCreateState {
  investment_goal: string;
  risk_tolerance: string;
  investment_ratio: string;
  investment_period: string;
  income_status: string;
  derivatives_experience: string;
}

interface GlobalState {
  user_create: UserCreateState;
  investmentPreference_create: InvestmentPreferenceCreateState;
}

interface GlobalContextType extends GlobalState {
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

const initialUserCreateState: UserCreateState = {
  tookie_id: '',
  name: '',
  password1: '',
  password2: '',
  email: '',
  phone_number: '',
  birth: '',
  gender: '',
  investment_level: 0,
};

const initialInvestmentPreferenceCreateState: InvestmentPreferenceCreateState = {
  investment_goal: '',
  risk_tolerance: '',
  investment_ratio: '',
  investment_period: '',
  income_status: '',
  derivatives_experience: ''
};

const initialState: GlobalState = {
  user_create: initialUserCreateState,
  investmentPreference_create: initialInvestmentPreferenceCreateState,
};

const GlobalContext = createContext<GlobalContextType>({
  ...initialState,
  setGlobalState: () => {}
});

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>(initialState);

  return (
    <GlobalContext.Provider value={{ ...globalState, setGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
