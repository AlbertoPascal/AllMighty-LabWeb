import React from 'react';
import {Navbar, Nav, Form, FormControl, Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class NavBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            search: "Que buscamos?"
        };
    }

    searchItem = (params) => {
        console.log(params.target.value)
    }

    render(){
        return(
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href ="/Home">Home</Nav.Link>
                <Nav.Link href ="/User">User</Nav.Link>
                <Nav.Link href ="/">{this.state.search}</Nav.Link>
            </Nav>
            <Form inline>
                <FormControl type="text" onChange={this.searchItem} placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar>
        );
    }
}

export default NavBar;