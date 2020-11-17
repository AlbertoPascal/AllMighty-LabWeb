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
      
        <Row >

          <Col xl={4} lg={4} md={4} sm={12} xs={12}>
            
          </Col>

          <Col xl={1} lg={1} md={1} sm={12} xs={12}>
            <img src={user.picture} alt={user.name} style={{ margin:"auto"}} width="100px" height="100px"/>
          </Col>
          
          <Col xl={4} lg={4} md={4} sm={12} xs={12}>
            <h1 color="#eee"> {user.name} </h1>
            <p>{user.email}</p>
          </Col>

        </Row>

     
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