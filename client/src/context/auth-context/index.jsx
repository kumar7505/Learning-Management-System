import { initialSignUpFormData, initialSignInFormData } from '@/config';
import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null);

function AuthProvider({children}){

  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  
  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);

    console.log(data);
    
  }
  return <AuthContext.Provider value={{
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
  }}> {children} </AuthContext.Provider>
}

export default AuthProvider;