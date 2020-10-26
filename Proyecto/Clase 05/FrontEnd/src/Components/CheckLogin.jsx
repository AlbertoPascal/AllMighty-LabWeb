import React from "react";
import App from "../App";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
    const {user, isAuthenticated, isLoading} = useAuth0();
    
    if(isLoading)
      return "";
    
    if(isAuthenticated){
      return (
        <App color={"rosa"}/>
      )
    }
    else{
      return(
        <LoginButton/>
      )
    }
  
  }
  
  const LoginButton = () =>{
    
    const {loginWithRedirect} = useAuth0();
  
    return (
  
      <div class = "text-center">
        <br></br>
        <h1>Inicia sesión para ingresar a la página</h1>
        <br></br>
        <button type="button" class="btn btn-primary btn-lg"  onClick={ () => loginWithRedirect()}>
          Log In
        </button>
      </div>
    )
  }

  class CheckLogin extends React.Component {
    render() {
        return (
          <Login/>
        );
      }
  }

  export default CheckLogin;