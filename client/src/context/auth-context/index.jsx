import { initialSignUpFormData, initialSignInFormData } from '@/config';
import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null);

function AuthProvider({children}){

  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);

  return <AuthContext.Provider value={{
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
  }}> {children} </AuthContext.Provider>
}

export default AuthProvider;