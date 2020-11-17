import React from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {useAuth0} from '@auth0/auth0-react';

import ProfileButtons from "./ProfileButtons"

import "../App.css"

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "Que buscamos?",
    };
  }

  searchItem = (params) => {
    this.setState({
      search: params.target.value,
    });
  };


  /*
    Additional nav links for other pages:
    <Nav.Link href="/home">Home</Nav.Link>
    <Nav.Link href="/user">User</Nav.Link>
  */

  /*
    Form for search bar:

    <Form inline>
      <FormControl
        type="text"
        onChange={this.searchItem}
        placeholder="Search"
        className="mr-sm-2"
      />
      <Button variant="outline-info">Search</Button>
      
    </Form>
  */

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" className="NavBar-Style" variant="dark">
        <Navbar.Brand className="NavBar-Title" href="/">All Mighty Health</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/products">Tienda</Nav.Link>
          </Nav>
          <ProfileButtons/>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default NavBar;
