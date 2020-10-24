import React from "react";
import ChatBot from "react-simple-chatbot";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Review extends React.Component {
  constructor(props) {
    console.log("Printing my props : ", props);
    super(props);
    this.to_render = {
      msgs : [],
      types : []
    }
    this.state = {
      msgs : [],
      types : []
    };
  }

  async componentDidMount() { //Didmount
    console.log("I will now be mounted: ", this.props);
    const { steps } = this.props;
    const { msg } = steps;
    console.log("steps has " , steps)
    console.log(msg.value);
    //console.log(this.call_whatson(msg.value));
    await this.call_whatson(msg.value).then((data)=>
    {
      for (const item of data)
      {
        let json_data = JSON.parse(item);
        
        this.setState(prevState => ({
          msgs: [...prevState.msgs, json_data.message],
          types: [...prevState.types, json_data.obj_type]
        }));
        console.log("State now has ", this.state);
      }
      //this.setState(data);
      console.log("finished setting state. ", this.state);
    });
  }
  async fill_objs_to_render(data_arr)
  {
    console.log("Starting fill objs to render ... ", data_arr);
    let messages = '';
    var fill_msgs = [];
    var fill_types = [];
    let test = [];
    for (const resp of data_arr)
      {
        console.log("My current response was: ", resp);
        
        //fill_types.push(resp.obj_type);
        //fill_msgs.push(resp.message);
        test.push(JSON.stringify(resp))
        messages = messages + resp.message + '\n'
        console.log("Added ", resp.message);
      }
      
      //console.log("returning from fill objs testing ", typeof(fill_msgs));
      //this.setState({msgs: fill_msgs, types: fill_types});
     // console.log("returning from fill objs to render: ",{messages: fill_msgs, obj_types: fill_types} );
    return (test);
  }
  async call_whatson(sent_msg){
    const usr = "test_user";
    //await getUserData();
    
    var messages = null;
    var obj_types = null;
    var obj_data = null;
    let watson =  await axios.post('http://localhost:5002/getMessage', { message: sent_msg, user: usr} ).then(resp => {
          console.log("My msg answer was ", resp.data.response);
          
          return resp.data.response;

          }).catch(error =>{console.log(error)});   
          
    console.log("Calling values separator" );
    let var_filling =  await this.fill_objs_to_render(await watson).then((results)=>{
      return results;
    });    
    //console.log("Outside of watson variable ", await var_filling);
    
  
    return await var_filling;
  }

  render() {
    console.log("rendering my state: ", this.state);
    //console.log("I need to print different messages : ",  this.to_render);
    //let curr_type =this.state.types.pop();
    //let curr_msg =  this.state.msgs.pop();

    return (
      <div style={{ width: '100%' }}>{this.state.msgs.map((msg, index) =>{
        let obj_type = this.state.types[index];
        console.log("For message ", msg, " my type is ", obj_type);
        return (
          (obj_type == 'Carousel')?(<Carousel>{ReactHtmlParser(msg)}</Carousel>):(<p>{ReactHtmlParser(msg)}</p>)
        );
      
      })}
          
          </div>
    );
    
    
    /*if (this.to_render.msgs.length > 0)
    {
      
      if (curr_type == "Carousel")
      {
        return (
            <Carousel width = "100%">{ReactHtmlParser(curr_msg)}</Carousel>
          );
      }
      else
      {
        return (
          <div style={{ width: '100%' }}>
          <div class = "container " width = "100%">{ ReactHtmlParser(curr_msg)}</div>
          </div>
        );
      }
    }

    */
    
    //var msg_td =  this.state.msg;
    //var inte = this.state.inte;
    //msg_td = msg_td.replace('<carousel>', '<Carousel>')
    //msg_td = msg_td.replace('</carousel>', '</Carousel>')
    //var code = {__html: msg_td}
    //const slides = Array.from(document.getElementById("slides").children)
    /*if (inte == 'Compras')
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
    );*/
    
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