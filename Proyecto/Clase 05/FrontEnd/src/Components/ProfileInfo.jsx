import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../App.css"

const Info = () => {
    const {user, isAuthenticated, isLoading} = useAuth0();
    console.log(user);
  
    if(isLoading)
      return "Cargando";
  
    return isAuthenticated ? (
      <div>
        <br/>
        <Row>

          <Col xl={2} lg={2} md={2} sm={12} xs={12}>
            <img src={user.picture} alt={user.name} width="150" height="150"/>
          </Col>
          
          <Col xl={10} lg={10} md={10} sm={12} xs={12}>
            <h1 color="#eee"> {user.name} </h1>
            <p>{user.email}</p>
          </Col>

        </Row>

      </div>
    ) : (
      <p>Error. Usuario no autentificado</p>
    );
  
  }

  class ProfileInfo extends React.Component {
    render() {
        return (
          <Info/>
        );
      }
  }

  export default ProfileInfo;