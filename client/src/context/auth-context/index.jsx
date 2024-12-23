import { initialSignUpFormData, initialSignInFormData } from '@/config';
import React, { createContext, useState } from 'react'
import { registerService, loginService } from '@/services';

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

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("User logged in successfully:", data);
      // Optionally clear the form after successful registration
      setSignUpFormData(initialSignInFormData);
    } catch (error) {
      console.error("logging in faileda:", error.message);
      // Handle error feedback, e.g., show an error message to the user
    }
  }


  return <AuthContext.Provider value={{
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  }}> {children} </AuthContext.Provider>
}

export default AuthProvider;