import React from 'react'
import { Button } from 'react-bootstrap';
import Products from '../Pages/Products';

export default class Carrito extends React.Component {

    constructor(props){
        super(props);
        this.catalogue = new Products();
    }

    render() {
        const {cartItems} = this.props;
        return (
            <div>
                {cartItems.length === 0 ? (
                    <div className="cart cart-header divProductosText">Cart is empty</div>
                    ) : (
                        <div className="cart cart-header divProductosText">
                            You have {cartItems.length} in the cart{" "}
                        </div>
                    )}
                    <div>
                        <div className = "cart divProductosText">
                            <ul className="cart-items">
                                {cartItems.map((item) => (
                                        <li key={item.id}>
                                        <div>
                                            <img src={item.img} alt={item.name}></img>
                                        </div>
                                        <div>
                                            <div>{item.name}</div>
                                            <div>{item.description}</div>
                                            <div className="right">
                                                {item.price} x {item.count} {" "}
                                                <Button onClick={()=>this.catalogue.removeFromCart(item)} variant="danger"> Quitar</Button>
                                            </div>
                                        </div>
                                        </li>
                                    ))}
                            </ul>    
                        </div>
                    </div>
            </div>
        );
    }
}
