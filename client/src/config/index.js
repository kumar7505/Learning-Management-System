export const signUpFormControls = [
    {
      name: "UserName",
      label: "User Name",
      placeholder: "Enter your user name",
      type: "text",
      componentType: "input",
    },
    {
      name: "UserEmail",
      label: "User Email",
      placeholder: "Enter your user email",
      type: "email",
      componentType: "input",
    },
    {
      name: "Password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      componentType: "input",
    },
];

export const signInFormControls = [
  {
    name: "UserEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "Password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const initialSignInFormData = [{
  userName: "",
  password: "",
}];

export const initialSignUpFormData = [{
  userName: "",
  userEmail: "",
  password: "",
}];