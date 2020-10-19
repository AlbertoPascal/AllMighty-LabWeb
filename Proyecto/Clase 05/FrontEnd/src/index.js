import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import {useAuth0} from '@auth0/auth0-react'
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CheckLogin = () => {
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

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
     domain="a01021323.auth0.com"
     clientId="dDYeTl9U1ZmOf5gkRaY6zDFj2iIN9Okj"
     redirectUri={window.location.origin}
    >
      <CheckLogin/>

    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
