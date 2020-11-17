import React from "react";
import data from "../data.json"
import Catalogo from "../Components/Catalogo"
import Filter from "../Components/Filter";
import Carrito from "../Components/Carrito";
import axios from 'axios';
import { Button } from "react-bootstrap";
import "../styles/Catalogo.css";

class Products extends React.Component {
  constructor(){
    super();
    this.state = {
      products: [],
      cartItems:[],
      type: "",
    };

    this.updateCarrito = this.updateCarrito.bind(this)
  }

  async componentDidMount(){
    
    //Set all the products from the user's cart
    await this.fetchWishlist().then((data)=>
    {

      const cartItems = this.state.cartItems.slice();
      
      if(data !=null){
        for (const cartItem of data)
        {
          cartItems.push(cartItem);
        }
      }

      this.setState({cartItems});
    });

    //Set all the products in the store
    await this.fetchProducts().then((data)=>
    {
      const products = this.state.products.slice();
      
      if(data !=null){
        for (const product of data)
        {
          products.push(product);
        }
      }
  
      this.setState({products});
    });

  }

  async updateCarrito() {

    let usr = localStorage.getItem('user');

    //http://127.0.0.1:5002
    let products = await axios.post('https://481bf7caceab.ngrok.io/getWishlist', { user: usr} ).then(resp => {
      
      return resp.data.wishlist;

      })
      .catch(error =>{
        console.log(error);
        return error;
    });  

    let cartItems = [];
    this.setState({cartItems});

    cartItems = this.state.cartItems.slice();
    
    if(products !=null){
      for (const cartItem of products)
      {
        cartItems.push(cartItem);
      }
    }
    else{
      cartItems = [];
    }

    this.setState({cartItems});
 
  }


  //Fetch all the products from the user's cart from the database
  async fetchWishlist(){
    let usr = localStorage.getItem('user');

    //http://127.0.0.1:5002
    let products = await axios.post('https://481bf7caceab.ngrok.io/getWishlist', { user: usr} ).then(resp => {
      
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

    let products = await axios.post('https://481bf7caceab.ngrok.io/getProducts', { }).then(resp => {
      
      return  resp.data.product_list;

      })
      .catch(error =>{
        console.log(error);
        return error;
    });  

    //let products = data.products;
    
    return await products;
  }


  async addToCart (product) {

    let usr = localStorage.getItem('user');

    await axios.post('https://481bf7caceab.ngrok.io/addProduct', { email: usr, name: product.name, type: product.type}).then(resp => {
      
      console.log(resp.data.msg);

    })
    .catch(error =>{
        console.log(error);
        return error;
    });  

    this.updateCarrito();
   
  }


  async removeFromCart (product, Items) {

    let usr = localStorage.getItem('user');

    await axios.post('https://481bf7caceab.ngrok.io/removeProduct', { email: usr, name: product.name, type: product.type}).then(resp => {
      
      console.log(resp.data.msg);

    })
    .catch(error =>{
        console.log(error);
        return error;
    });  
    
    this.updateCarrito();

  }

  //Function to buy all the products in the cart
  async buy(){

    let usr = localStorage.getItem('user');

    await axios.post('https://481bf7caceab.ngrok.io/buy', { email: usr}).then(resp => {
      
      console.log(resp.data.msg);
      
      let cartItems = [];
      this.setState({cartItems});
      alert("¡Muchas gracias por comprar con nosotros!")

    })
    .catch(error =>{
        console.log(error);
        return error;
    }); 

    
  }


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

    let emptyCart = true;

    if(this.state.cartItems.length == 0){
      emptyCart = false;
    }

    return (
      <div className="grid-container divProductos">
  
          <div className="content">
            <div className="main">
              <Filter count={this.state.products.length} 
              type={this.state.type}
              typeProducts={this.typeProducts}  
              >
              
              </Filter>

              <Catalogo products={this.state.products} addToCart={this.addToCart} cartItems={this.state.cartItems} updateCarrito={this.updateCarrito}></Catalogo>
            </div>
            <div className="sidebar">
              <Carrito cartItems={this.state.cartItems} removeFromCart={this.removeFromCart} updateCarrito={this.updateCarrito}/>

              {emptyCart ? (<Button variant="success buttonCart" onClick={()=>this.buy()} >Comprar Productos</Button>): (<div></div>)}
              
            </div>
            
          </div>

      </div>
      
    )
  }
}
export default Products;

