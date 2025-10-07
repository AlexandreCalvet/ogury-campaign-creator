import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  authToken: string;
  authStatus: string;
  clientId: string;
  clientSecret: string;
}

interface AppState {
  response: any;
  requestBody: string;
  isLoading: boolean;
  jsonFormat: 'pretty' | 'raw';
}

interface AppContextType {
  authState: AuthState;
  appState: AppState;
  setAuthState: (state: Partial<AuthState>) => void;
  setAppState: (state: Partial<AppState>) => void;
  authenticate: (clientId: string, clientSecret: string) => Promise<void>;
  resetAuth: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [authState, setAuthStateState] = useState<AuthState>({
    isAuthenticated: false,
    authToken: '',
    authStatus: '',
    clientId: '',
    clientSecret: ''
  });

  const [appState, setAppStateState] = useState<AppState>({
    response: null,
    requestBody: '',
    isLoading: false,
    jsonFormat: 'pretty'
  });

  const setAuthState = (newState: Partial<AuthState>) => {
    setAuthStateState(prev => ({ ...prev, ...newState }));
  };

  const setAppState = (newState: Partial<AppState>) => {
    setAppStateState(prev => ({ ...prev, ...newState }));
  };

  const authenticate = async (clientId: string, clientSecret: string) => {
    if (!clientId || !clientSecret) {
      setAuthState({ authStatus: 'Please enter both Client ID and Client Secret' });
      return;
    }

    setAppState({ isLoading: true });
    setAuthState({ authStatus: 'Authenticating...' });
    
    try {
      const axios = (await import('axios')).default;
      const response = await axios.post(
        '/oauth/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: clientId,
            password: clientSecret
          }
        }
      );

      const authData = response.data;
      setAuthState({
        authToken: authData.access_token,
        isAuthenticated: true,
        authStatus: 'Authentication successful!',
        clientId,
        clientSecret
      });
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthState({ authStatus: `Authentication failed: ${error.message}` });
    } finally {
      setAppState({ isLoading: false });
    }
  };

  const resetAuth = () => {
    setAuthState({
      isAuthenticated: false,
      authToken: '',
      authStatus: '',
      clientId: '',
      clientSecret: ''
    });
  };

  const value: AppContextType = {
    authState,
    appState,
    setAuthState,
    setAppState,
    authenticate,
    resetAuth
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
