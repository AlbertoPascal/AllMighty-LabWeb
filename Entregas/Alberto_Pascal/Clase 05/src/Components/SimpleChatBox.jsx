import React from "react";
import ChatBot from "react-simple-chatbot";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function SimpleChatBox(props) {
    const config = {
        width: "400px",
        height: "600px",
        floating: true
    };
      //https://lucasbassetti.com.br/react-simple-chatbot/#/docs/custom
    const steps = [
        {
            id: "Salutations",
            message: "Hello! This is Alberto's Homework. I'm Sh4d0wCrack.",
            trigger: "GetName"
        },
        {
            id: "GetName",
            message: "Who are you?",
            trigger: "WaitForName",
        },
        {
                id: "WaitForName",
                user: true,
                trigger: "Greet"
        },
        {
            id: "Greet",
            message: "Nice to meet you, {previousValue}!",
            trigger: "Help",
        },
        {
            id: "Help",
            message: "How may I help you?",
            trigger: "Options"
        },
        {
          id:"HelpLoop", 
          message: "Interesting choice! Do you need anything else?",
          trigger : "LoopOptions"
        },
        {
          id:"LoopOptions",
          options: [
            {
              value:"Yes", 
              label:"Yes", 
              trigger: "Help"
            },
            {
              value:"No", 
              label: "No", 
              trigger: "Bye"
            }
          ]
        },
        {
          id: "Bye",
          message: "It was nice chatting with you!"
        },
        {
            id: "Options",
            options: [
                        {
                            value: "Dog pics",
                            label: "Dog pics",
                            trigger: "ShowDogs"
                        },
                        { 
                            value: "Memes",
                            label: "Memes",
                            trigger: "ShowMemes"
                        } ,
                        {
                          value: "Joke",
                          label: "Tell a joke", 
                          trigger: "SayJoke"
                        }
                    ]
        },
        {
          id: "ShowDogs",
          component: (
            <div class = "container" width="100%">

              <Carousel>
                  <div>
                      <img src={require("../img/1.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/2.gif")} />
                     
                  </div>
                  <div>
                      <img src={require("../img/3.gif")} />
                   
                  </div>
                  <div>
                      <img src={require("../img/4.gif")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/5.gif")} />
                   
                  </div>
                  <div>
                      <img src={require("../img/6.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/7.gif")} />
                     
                  </div>
                  <div>
                      <img src={require("../img/8.gif")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/9.gif")} />
                    
                  </div>
                  <div>
                      <img src={require("../img/10.gif")} />
                     
                  </div>
                  <div>
                      <img src={require("../img/11.jpg")} />
                    
                  </div>
                  <div>
                      <img src={require("../img/12.gif")} />
                
                  </div>
              </Carousel>
            </div>
          ),
          trigger: "HelpLoop"
        },
        {
          id: "ShowMemes",
          component: (
            <div class = "container" width="100%">

              <Carousel>
                  <div>
                      <img src={require("../img/m2.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/m3.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/m4.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/m5.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/m6.jpg")} />
                      
                  </div>
                  <div>
                      <img src={require("../img/m1.jpg")} />
                      
                  </div>
                  
              </Carousel>
            </div>
          ),
          trigger: "HelpLoop"
        },
        {
          id: "SayJoke",
          component: (
            <div class = "card" width="100%">
                <h1>¿Qué hace un pez mago?</h1>
                <h2>Nada por aquí... y nada por allá!</h2>
            </div>
          ),
          trigger:"HelpLoop"
        }
        
    ];
  return <ChatBot steps={steps} {...config} />;
}
export default SimpleChatBox;