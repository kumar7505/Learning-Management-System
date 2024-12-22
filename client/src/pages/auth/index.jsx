import React, {useContext} from "react";
import {GraduationCap} from "lucide-react";
import { Link } from "react-router-dom";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import { useState } from "react";
import { signUpFormControls, signInFormControls } from "@/config";
import CommonForm from "@/components/common-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData } = useContext(AuthContext) 

    function checkIfSignInFormIsValid() {
      return signInFormData && 
      signInFormData.userEmail !== '' &&
      signInFormData.password !== ''; 
    }

    function checkIfSignUpFormIsValid(){
      return signUpFormData && 
      signUpFormData.userName !== '' &&
      signUpFormData.userEmail !== '' &&
      signUpFormData.password !== ''; 
    }

    console.log(signInFormControls);
    console.log(signInFormData);
    
    

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
      </header>

      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={e => setActiveTab(e)}
          className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card className="p-6 space-y-4">

                <CardHeader>
                  <CardTitle>Sign in to your account</CardTitle>
                  <CardDescription>
                    Enter your email and Password to access your Account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  />
                </CardContent>

              </Card>
            </TabsContent>
            <TabsContent value="signup">
            <Card className="p-6 space-y-4">

              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                formControls={signUpFormControls}
                buttonText={"Sign Up"}
                formData={signUpFormData}
                setFormData={setSignUpFormData}
                isButtonDisabled={!checkIfSignUpFormIsValid()}
                />
              </CardContent>

            </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
