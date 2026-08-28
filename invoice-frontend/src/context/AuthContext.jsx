import React, { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({children}) {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (loginRequest) => {
    const response = await axiosInstance.post('/auth/login', loginRequest);

    const {token: newToken, email: userEmail} = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('email', userEmail);

    setToken(newToken);
    setEmail(userEmail);
  };


  const register = async (registerRequest) => {
    axiosInstance.post('/auth/register', registerRequest);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{token, email, isAuthenticated, loading, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  const context = useContext(AuthContext);
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
