import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card, Button, CardColumns } from 'react-bootstrap';
import "../App.css"

const CatalogoInfo = () => {
    return (
      <Container>
        <Row >
        <br/>
          <Col > 
          <h1>Macaras</h1> 
            <CardColumns>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://resources.claroshop.com/medios-plazavip/mkt/5ebe0bc1eb8a9_templa1jpg.jpg" />
                        <Card.Body>
                            <Card.Title>Kn95</Card.Title>
                            <Card.Text>
                                <p>Precio: 70 <br />
                                Cantidad en caja: 1 <br />
                                Mascara kn95 oficial, filtra el 95% del aire
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://i.pinimg.com/originals/8d/93/1d/8d931d284f0b1b7fdcf51aaa76007298.png" />
                        <Card.Body>
                            <Card.Title>Tela</Card.Title>
                            <Card.Text>
                                <p>Precio: 50 <br />
                                Cantidad en caja: 1 <br />
                                Mascara de algodon color negro
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://cdn.shopify.com/s/files/1/0310/4695/9163/products/55437DE9237D65AC6E3F422F28FE72C6_grande.png?v=1585989193" />
                        <Card.Body>
                            <Card.Title>Desechables</Card.Title>
                            <Card.Text>
                                <p>Precio: 70 <br />
                                Cantidad en caja: 1 <br />
                                Mascara desechable que azul
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
            </CardColumns>
          </Col>
        
          <Col > 
          <h1>Desinfectante</h1> 
            <CardColumns>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://www.educarelibros.com/store1/image/cache/catalog/Pape/Gel%20Antibacterial-500x500.jpg" />
                        <Card.Body>
                            <Card.Title>Bote Chico</Card.Title>
                            <Card.Text>
                                <p>Precio: 50 <br />
                                Tamaño chico: 250ml <br />
                                Cantidad en caja: 1 <br />
                                Gel Antibacterial
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://resources.claroshop.com/medios-plazavip/s2/10173/1359461/5e7fbb5bcf7ce-combo-kingsman-05-1-1600x1600.jpg" />
                        <Card.Body>
                            <Card.Title>Bote Meidano</Card.Title>
                            <Card.Text>
                                <p>Precio: 70 <br />
                                Tamaño mediano: 500ml <br />
                                Cantidad en caja: 1 <br />
                                Gel Antibacterial
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://www.fulloffice.com.ec/wp-content/uploads/2016/07/GEL-ANTIBACTERIAL-MEDIANO.jpg" />
                        <Card.Body>
                            <Card.Title>Bote Grande</Card.Title>
                            <Card.Text>
                                <p>Precio: 100 <br />
                                Tamaño grande: 1L <br />
                                Cantidad en caja: 1 <br />
                                Gel Antibacterial
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
            </CardColumns>
          </Col>
          <Col > 
          <h1>Termometros</h1> 
            <CardColumns>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://www.officedepot.com.mx/medias/93508.jpg-515ftw?context=bWFzdGVyfHJvb3R8MzMyMDl8aW1hZ2UvanBlZ3xoNjgvaDJiLzk4NjQzNzc2NjM1MTguanBnfGQ3ZjQ5YzI3MWI5NGJkOWY3ZTcwZTI3NTExOWQ4OGZlYWFhZjllMDdlNWI3YmJkZGRiMDllNDc2OGVmY2NmOTc" />
                        <Card.Body>
                            <Card.Title>Digital</Card.Title>
                            <Card.Text>
                                <p>Precio: 300 <br />
                                Cantidad en caja: 1 <br />
                                Termometro digital infrarojo sin contacto
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://i1.wp.com/reciclario.com.ar/wp-content/uploads/termometro.jpg?resize=400%2C310" />
                        <Card.Body>
                            <Card.Title>Mercurio</Card.Title>
                            <Card.Text>
                                <p>Precio: 100 <br />
                                Cantidad en caja: 1 <br />
                                Termometro de mercurio de aplicacion oral
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
            </CardColumns>
          </Col>
          <Col > 
          <h1>Pruebas</h1> 
            <CardColumns>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://img.freepik.com/foto-gratis/covid-19-prueba-laboratorio-hisopo-nasal-laboratorio-hospital-enfermera-sosteniendo-tubo-ensayo-sangre-analisis-2019-ncov-nuevo-concepto-analisis-sangre-coronavirus-chino_1212-2123.jpg?size=626&ext=jpg" />
                        <Card.Body>
                            <Card.Title>Nasofarinje (antígeno)</Card.Title>
                            <Card.Text>
                                <p>Precio: 1,500 <br />
                                Cantidad en caja: 1 <br />
                                Prueba por via nasal cualitativa (+/-) que detecta proteínas del virus, supone una prueba de infección activa y los resultados pueden conocerse a los 10-15 minutos.
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://elglobal.es/wp-content/uploads/2020/03/GettyImages-1212988270-scaled.jpg" />
                        <Card.Body>
                            <Card.Title>Sangre (anticuerpo)</Card.Title>
                            <Card.Text>
                                <p>Precio: 3,000 <br />
                                Cantidad en caja: 1 <br />
                                Prueba mediante una muestra de sangre, cualitativa (+/-) que aproximadamente detecta los anticuerpos a los 7 días  desde los síntomas y os resultados pueden conocerse a los 10-15 minutos.
                                </p>
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                        </Card.Body>
                </Card>
            </CardColumns>
          </Col>
        </Row>
      </Container>
      
    )
  
  }

  class Catalogo extends React.Component {
    render() {
        return (
          <CatalogoInfo/>
        );
      }
  }

  export default Catalogo;