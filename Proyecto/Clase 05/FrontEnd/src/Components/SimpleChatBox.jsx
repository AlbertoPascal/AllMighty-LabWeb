import React from "react";
import ChatBot from "react-simple-chatbot";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
var parse = require('html-react-parser');

class Review extends React.Component {
  constructor(props) {
    console.log("Printing my props : ", props);
    super(props);

    this.state = {
      inte:'',
      msg: '',
    };
  }

  async componentWillMount() {
    console.log("I will now be mounted: ", this.props);
    const { steps } = this.props;
    const { msg } = steps;
    console.log("steps has " , steps)
    console.log(msg.value);
    console.log(this.call_whatson(msg.value));
    
     this.setState(await this.call_whatson(msg.value));
  }

  async call_whatson(sent_msg){
    return await axios.post('http://localhost:5002/getMessage', { message: sent_msg} )
        .then(resp => {
          console.log("My msg answer was ", resp);
          return resp.data;
        }
        ).catch(err => console.log(err))
    //return "hola crayola";
  }

  /*async call_whatson_intent(sent_msg){
    return await axios.post('http://localhost:5002/getIntent', { intent: sent_msg} )
        .then(resp => {
          console.log("My intent was ", resp);
          return resp.data.este_es_el_intent;
        }
        ).catch(err => console.log(err))
    //return "hola crayola";
  }*/

  render() {
    console.log("rendering my state: ", this.state);
    var msg_td =  this.state.msg;
    var inte = this.state.inte;
    msg_td = msg_td.replace('<carousel>', '<Carousel>')
    msg_td = msg_td.replace('</carousel>', '</Carousel>')
    var code = {__html: msg_td}
    //const slides = Array.from(document.getElementById("slides").children)
    if (inte == 'Compras')
    {
      console.log("Hasta aquí todo bien");
      return (
       <Carousel width = "100%">{ReactHtmlParser(msg_td)}</Carousel>
      );
    }
    return (
      <div style={{ width: '100%' }}>
        <div class = "container " width = "100%">{ ReactHtmlParser(msg_td)}</div>
      </div>
    );
  }
}

class SimpleChatBox extends React.Component {
  render(){
    return(
      <ChatBot steps={
        [
          {
            id: '1',
            message: 'What is your message?',
            trigger: 'msg',
          },
          {
            id: 'msg',
            user: true,
            trigger: 'review',
          },  
          {
            id: 'review',
            component: <Review />,
            asMessage: true,
            trigger: 'msg'
          }
        ]
      } {...{
        width: "400px",
        height: "600px",
        floating: true
    }} />
    )
  }

}
export default SimpleChatBox;

function detective_whatson(msg)
{
  return msg;

}