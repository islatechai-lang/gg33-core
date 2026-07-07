import { createContext, useContext } from 'react';

interface WhopContextType {
  basePath: string;
  experienceId?: string;
  companyId?: string;
  isWhopApp: boolean;
}

const WhopContext = createContext<WhopContextType>({
  basePath: '',
  isWhopApp: false,
});

export function useWhopContext() {
  return useContext(WhopContext);
}

interface WhopProviderProps {
  children: React.ReactNode;
  experienceId?: string;
  companyId?: string;
}

export function WhopProvider({ children, experienceId, companyId }: WhopProviderProps) {
  let basePath = '';
  
  if (experienceId) {
    basePath = `/experiences/${experienceId}`;
  } else if (companyId) {
    basePath = `/dashboard/${companyId}`;
  }

  return (
    <WhopContext.Provider value={{
      basePath,
      experienceId,
      companyId,
      isWhopApp: !!experienceId || !!companyId,
    }}>
      {children}
    </WhopContext.Provider>
  );
}

export function useWhopLink(path: string): string {
  const { basePath } = useWhopContext();
  if (path.startsWith('/')) {
    return basePath + path;
  }
  return basePath + '/' + path;
}
