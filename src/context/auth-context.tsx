
// src/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import usersData from '@/data/users.json';

// Definir los tipos de roles
type UserRole = 'admin' | 'vendedor' | 'cliente_especial' | 'cliente';

// Definir la forma del objeto de usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Usuarios de ejemplo
const DUMMY_USERS: User[] = usersData as User[];

// Definir la forma del contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean, message?: string, user?: User };
  logout: () => void;
  register: (name: string, email: string, password: string) => { success: boolean, message?: string, user?: User };
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    // Simulación de credenciales de administrador
    if (email.toLowerCase() === 'sistemas@distrimin.com' && password === '123') {
        const adminUser = DUMMY_USERS.find(u => u.email.toLowerCase() === 'sistemas@distrimin.com');
        if (adminUser) {
            setUser(adminUser);
            localStorage.setItem('user', JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }
    }

    // Lógica para otros usuarios (se ignora la contraseña por ser simulación)
    const foundUser = DUMMY_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    
    // Simulación de búsqueda en usuarios registrados en localStorage
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundRegisteredUser = registeredUsers.find((u: User) => u.email === email);

        if (foundRegisteredUser) {
            // Para usuarios registrados, se ignora la contraseña en esta simulación
            setUser(foundRegisteredUser);
            localStorage.setItem('user', JSON.stringify(foundRegisteredUser));
            return { success: true, user: foundRegisteredUser };
        }
    } catch(error) {
         console.error("Failed to parse registered_users from localStorage", error);
    }

    return { success: false, message: 'Correo o contraseña incorrectos.' };
  };
  
  const register = (name: string, email: string, password: string) => {
      // Simulación de registro
      try {
          const registeredUsers: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
          const existingUser = registeredUsers.find(u => u.email === email) || DUMMY_USERS.find(u => u.email === email);

          if (existingUser) {
              return { success: false, message: 'Este correo electrónico ya está registrado.' };
          }
          
          const newUser: User = {
              id: `user_${Date.now()}`,
              name,
              email,
              role: 'cliente', // Por defecto se registran como clientes
          };

          registeredUsers.push(newUser);
          localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

          // Iniciar sesión automáticamente después del registro
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          return { success: true, user: newUser };

      } catch (error) {
          console.error("Failed to handle registration in localStorage", error);
          return { success: false, message: 'Ocurrió un error durante el registro.' };
      }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
