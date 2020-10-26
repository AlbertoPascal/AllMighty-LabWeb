import React from "react";
import CarouselHome from '../Components/CarouselHome';
import '../App.css'

class Home extends React.Component {
  render() {
    return (
      <div>
        <br/>
        <h1 className="titulo">Productos ofrecidos</h1>
        <br/>
        <br/>
        <CarouselHome/>
      </div>
    );
  }
}
export default Home;
