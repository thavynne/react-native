import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSignedIn: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSignedIn: false,
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Estado de autenticação mudou:', currentUser?.email || 'Não autenticado');
      setUser(currentUser);
      setLoading(false);
    });

    // Limpar inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('Usuário desconectado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isSignedIn: user !== null,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
