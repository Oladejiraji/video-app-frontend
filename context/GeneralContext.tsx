import {
  useState,
  useContext,
  createContext,
  useMemo,
  ReactElement,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
//! Types
interface IProps {
  children: ReactElement;
}

type Theme = "light" | "dark";

interface GeneralContextType {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  userId: string;
}

const initialTheme = "light" as Theme;

const initialValues = {
  theme: initialTheme,
  updateTheme: () => {},
  userId: uuidv4(),
};

const GeneralContext = createContext<GeneralContextType>(initialValues);

export const useGeneralContext = () => {
  return useContext(GeneralContext);
};

const GeneralContextProvider = ({ children }: IProps) => {
  const [theme, setTheme] = useState<Theme>("light");
  const { userId } = useGeneralContext();

  // ! Update theme
  const updateTheme = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {});

  const memoizedData = useMemo(
    () => ({
      theme,
      updateTheme,
      userId,
    }),
    [theme]
  );
  return (
    <GeneralContext.Provider value={memoizedData}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
