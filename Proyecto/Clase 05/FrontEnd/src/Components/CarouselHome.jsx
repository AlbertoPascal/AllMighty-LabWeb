import React from "react";
import Carousel1 from '../img/cubrebocas.jpg'
import Carousel2 from '../img/gel.jpg'
import Carousel3 from '../img/prueba_covid.jpg'
import Carousel4 from '../img/termometro.jpg'
import Carousel from 'react-bootstrap/Carousel'
import '../App.css'

const CarouselItems = () => {
  
    return (
    
      <Carousel>
          <Carousel.Item>
            <img
              width = {700}
              height = {500}
              className="d-block w-100"
              src={Carousel1}
              alt="Cubrebocas"
            />
            <Carousel.Caption>
              <h3>Cubrebocas</h3>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
                width = {700}
                height = {500}
                className="d-block w-100"
                src={Carousel2}
                alt="Desinfectante"
              />
            <Carousel.Caption>

              <h3>Desinfectante y gel antibacterial</h3>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
                width = {700}
                height = {500}
                className="d-block w-100"
                src={Carousel3}
                alt="Prueba de covid"
              />
            <Carousel.Caption>
     
              <h3>Pruebas para Covid-19</h3>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
                width = {700}
                height = {500}
                className="d-block w-100"
                src={Carousel4}
                alt="Termómetro"
              />
            <Carousel.Caption>
            
              <h3>Termómetros</h3>
            </Carousel.Caption>
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