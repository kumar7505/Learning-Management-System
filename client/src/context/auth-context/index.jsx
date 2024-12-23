import { initialSignUpFormData, initialSignInFormData } from '@/config';
import React, { createContext, useState } from 'react'
import { registerService } from '@/services';

export const AuthContext = createContext(null);

function AuthProvider({children}){

  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  
  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      console.log("User registered successfully:", data);
      // Optionally clear the form after successful registration
      setSignUpFormData(initialSignUpFormData);
    } catch (error) {
      console.error("Registration faileda:", error.message);
      // Handle error feedback, e.g., show an error message to the user
    }
    
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