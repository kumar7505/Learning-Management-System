import { initialSignUpFormData, initialSignInFormData } from '@/config';
import React, { createContext, useEffect, useState } from 'react'
import { registerService, loginService, checkAuthService } from '@/services';

export const AuthContext = createContext(null);

function AuthProvider({children}){

  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  async function handleRegisterUser(event) {
    console.log("handleRegisterUser");
    
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
    console.log("handleLoginUser");
    
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("User logged in successfully:", data);
      // Optionally clear the form after successful registration
      setSignUpFormData(initialSignInFormData);
      console.log(data.data.accessToken);
      if(data.success){
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }


    } catch (error) {
      console.error("logging in faileda:", error.message);
      // Handle error feedback, e.g., show an error message to the user
    }

  }

  async function checkAuthUser(){
    console.log("checkAuthUser");
    
    const data = await checkAuthService();

    if(data.success){
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      }); 
    }
    
  console.log("kumaranjab");
  console.log(auth);
  }


  useEffect(() => {
    checkAuthUser();
  }, [])

  
  

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