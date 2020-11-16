import React from "react";
import data from "../data.json"
import Catalogo from "../Components/Catalogo"
import Filter from "../Components/Filter";
import Carrito from "../Components/Carrito";
import axios from 'axios';

class Products extends React.Component {
  constructor(){
    super();
    this.state = {
      products: [],
      cartItems:[],
      type: "",
    };
  }

  async componentDidMount(){
    
    //Set all the products from the user's cart
    await this.fetchWishlist().then((data)=>
    {
      const cartItems = this.state.cartItems.slice();
      
      for (const cartItem of data)
      {
        cartItems.push(cartItem);
      }
      this.setState({cartItems});
    });
    
    //Set all the products in the store
    await this.fetchProducts().then((data)=>
    {
      const products = this.state.products.slice();
      
      for (const product of data)
      {
        products.push(product);
      }
      this.setState({products});
    });

  }

  //Fetch all the products from the user's cart from the database
  async fetchWishlist(){
    let usr = localStorage.getItem('user');
    console.log("My user is: ", usr);
    let products = await axios.post('http://127.0.0.1:5002/getWishlist', { user: usr} ).then(resp => {
      console.log("My msg answer was ", resp);
      
      return resp.data.wishlist;

      })
      .catch(error =>{
        console.log(error);
        return error;
    });  

    //let products = data.products;
    
    return await products;
  }

  
  //Fetch all the products from the database
  async fetchProducts(){

    /*let products = await axios.post('http://127.0.0.1:5002/getProducts', { }).then(resp => {
      console.log("My msg answer was ", resp.data.response);
      
      return resp.data.response;

      })
      .catch(error =>{
        console.log(error);
        return error;
    });  */

    let products = data.products;
    
    return await products;
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

  //<footer className="footer">Footer en honor al profe de Desarrollo Web.</footer>

  render() {
    return (
      <div className="grid-container divProductos">
  
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

      </div>
      
    );
  }
}
export default Products;

