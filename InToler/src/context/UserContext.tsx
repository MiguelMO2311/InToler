import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models/User'; // Importa User desde tu archivo models

export const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}>({
  user: null, // Inicializa el estado del usuario con null
  setUser: () => { },
  loading: true, // Inicializa el estado de carga con true
});

type UserProviderProps = {
  children: ReactNode;
};

// Crear el componente UserProvider con TypeScript
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Inicializa el estado del usuario con null
  const [loading, setLoading] = useState(true); // Inicializa el estado de carga con true

  // Cuando se carga la página, comprobamos si hay información del usuario en el localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Actualizamos el estado del usuario con la información del localStorage
    }
    setLoading(false); // Establecemos el estado de carga en false después de cargar los datos del usuario
  }, []);

  // Cuando el estado del usuario cambia, actualizamos la información del usuario en el localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
