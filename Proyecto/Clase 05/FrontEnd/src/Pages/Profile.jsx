import React from "react";
import axios from 'axios';
import ProfileInfo from "../Components/ProfileInfo"
import PurchasesProfile from "../Components/PurchasesProfile"

class Profile extends React.Component {

  constructor(){
    super();
    this.state = {
      desinfectante: 0,
      mascaras:0,
      pruebas:0,
      termometro:0
    };
  }

  async componentDidMount(){
    
    //Set all the products from the user's cart
    await this.fetchBuyHistory().then((data)=>
    {
      
      if(data !=null){
        
        let desinfectante = data.desinfectante;
        let mascaras = data.mascaras;
        let pruebas = data.pruebas;
        let termometro = data.termometro;

        this.setState({desinfectante});
        this.setState({mascaras});
        this.setState({pruebas});
        this.setState({termometro});
      }
    });
  }

  async fetchBuyHistory(){

    let usr = localStorage.getItem('user');

    //http://127.0.0.1:5002
    let purchases = await axios.post('http://127.0.0.1:5002/buyHistory', { email: usr} ).then(resp => {
      console.log(resp.data.transactions);

      return resp.data.transactions;

      })
      .catch(error =>{
        console.log(error);
        return error;
    });  

    //let products = data.products;
    return await purchases;
  }

  render() {
    return (
      <div>
        <ProfileInfo/>
        <PurchasesProfile desinfectante={this.state.desinfectante} mascaras={this.state.mascaras} pruebas={this.state.pruebas} termometro={this.state.termometro}/>
      </div>

    );
  }
}
export default Profile;
