import React from "react";
import data from "../data.json"
import Catalogo from "../Components/Catalogo"
import Filter from "../Components/Filter";
import Carrito from "../Components/Carrito";

class Products extends React.Component {
  constructor(){
    super();
    this.state = {
      products: data.products,
      cartItems:[],
      type: "",
    };
  }
  addToCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    let alreadyInCart =false;
    cartItems.forEach((item) => {
      if (item.id === product.id){
        item.count++;
        alreadyInCart= true;
      }
    });
    if (!alreadyInCart){
      cartItems.push({...product, count: 1});
    }
    this.setState({cartItems});
  };

  typeProducts =(event) => {
    console.log(event.target.value);
    if(event.target.value === ""){
      this.setState({type: event.target.value, product:data.products});
    } else{
      this.setState({
        type: event.target.value,
        products: data.products.filter(
          (product) => product.type.indexOf(event.target.value)>=0),
      });
    }
  }  
  render() {
    return (
      <div className="grid-container">
        <main>
          <div className="content">
            <div className="main">
              <Filter count={this.state.products.length} 
              type={this.state.type}>
              typeProducts={this.typeProducts}  
              </Filter>

              <Catalogo products={this.state.products} addToCart={this.addToCart}></Catalogo>
            </div>
            <div className="sidebar">
              <Carrito cartItems={this.state.cartItems}/>
            </div>
          </div>
          </main>
        <footer className="footer">Footer en honor al profe de Desarrollo Web.</footer>
      </div>
      
    );
  }
}
export default Products;

