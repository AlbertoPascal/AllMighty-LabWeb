import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import {useAuth0} from '@auth0/auth0-react'

const Buttons = () => {
  const {user, isAuthenticated, isLoading} = useAuth0();

  if(isLoading)
    return "";

  return isAuthenticated ? (
    <div>
      <ProfileButton/>
      <LogoutButton/>
    </div>
  ) : (
    <LoginButton/>
  );

}

const LoginButton = () =>{
  const {loginWithRedirect} = useAuth0();

  return (
    <Button variant="outline-light" onClick={ () => loginWithRedirect()}>
      Iniciar Sesión
    </Button>
  )
}

const ProfileButton = () =>{
  const {logout} = useAuth0();

  return (
   
      <Button variant="outline-light" href="/profile">
      Perfil
      </Button>
      
  )
}

const LogoutButton = () =>{
  const {logout} = useAuth0();

  return (
      
      <Button variant="outline-light" onClick={ () => logout({ returnTo: window.location.origin})}>
        Cerrar Sesión
      </Button>
    
  )
}

class ProfileButtons extends React.Component {
    render() {
        return (
          <Buttons/>
        );
      }
  }

  export default ProfileButtons;