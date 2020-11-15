import React from 'react'

export default class Carrito extends React.Component {
    render() {
        const {cartItems} = this.props;
        return (
            <div>
                {cartItems.length === 0 ? (
                    <div className="cart cart-header">Cart is empty</div>
                    ) : (
                        <div className="cart cart-header">
                            You have {cartItems.length} in the cart{" "}
                        </div>
                    )}
                    <div>
                        <div className = "cart">
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
                                                <button onClick={()=>this.props.removeFromCart(item)}> Quitar</button>
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
