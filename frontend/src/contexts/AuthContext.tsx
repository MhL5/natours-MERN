import { PropsWithChildren, createContext, useContext, useState } from "react";

type AuthContextType = {
  setUserFn: (user: UserType | null) => void;
  user: UserType | null;
};
type AuthProviderProps = PropsWithChildren;
type UserType = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  __v: number;
  password: null;
  passwordChangedAt: null;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  function setUserFn(user: UserType | null) {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return;
    }

    localStorage.removeItem("user");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, setUserFn }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("Auth context was called outside of its provider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAuthContext };
export default AuthProvider;
