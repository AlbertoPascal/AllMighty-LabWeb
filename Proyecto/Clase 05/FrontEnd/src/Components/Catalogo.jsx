import React from "react";
import { useAuth0 } from '@auth0/auth0-react';

import { Card, Button, CardColumns } from 'react-bootstrap';
import "../App.css"
import "../styles/Catalogo.css";

  

  export default class Catalogo extends React.Component {
    render() {
      return (        
        <div>         
              <CardColumns className= "products">
              {this.props.products.map((item)=>(
                <Card key={item.id} className="product" >
                    <Card.Img variant="top" src={item.img} alt={item.name} />
                        <Card.Body>
                            <Card.Title><h2>{item.name}</h2></Card.Title>
                            <Card.Text>
                                <p className="product-price">Price: ${item.price}</p>
                                {item.description} <br/>
                                tipo: {item.type}
                            </Card.Text>
                            <button onClick={()=>this.props.addToCart(item)} className="button primary">Comprar</button>
                        </Card.Body>
                </Card>
                ))}
              </CardColumns>    
        </div>        
      )
    }
  }

  //export default CatalogoInfo;