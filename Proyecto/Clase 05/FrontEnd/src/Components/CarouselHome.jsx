import React from "react";
import { Button } from "react-bootstrap";
import Carousel1 from '../img/Fondo 1.png'
import Carousel2 from '../img/Fondo 2.png'
import Carousel3 from '../img/prueba_covid.jpg'
import Carousel4 from '../img/termometro.jpg'
import Carousel from 'react-bootstrap/Carousel'
import '../App.css'


const CarouselItems = () => {
  
    return (
    
      <Carousel>
          <Carousel.Item>
            <div className="carouselContainer">
              <h1 className="carouselCentered tituloCarousel">
                Contamos con una gran cantidad de productos
              </h1>
              <h1 className="carouselCentered2 tituloCarousel">
                Revisa nuestro catálogo
              </h1>
              <Button className="carouselCentered3 carouselButton"  href="/products">Dando click aquí</Button>
              <img
                width = {700}
                height = {600}
                className="d-block w-100"
                src={Carousel1}
                alt="slide 1"
              />
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div className="carouselContainer">
              <h1 className="carouselCentered tituloCarousel">
                ¿Necesitas ayuda? 
              </h1>
              <h2 className="carouselCentered2 tituloCarousel">
                Utiliza nuestro bot asistente de compras
              </h2>
              <img
                width = {700}
                height = {600}
                className="d-block w-100"
                src={Carousel2}
                alt="slide 2"
              />
            </div>
          </Carousel.Item>

      </Carousel>
    )
}

class CarouselHome extends React.Component {
  render() {
      return (
        <CarouselItems/>
      );
    }
}

export default CarouselHome;