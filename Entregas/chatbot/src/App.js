import React from 'react';
import ReactDOM from "react-dom";
import Home from "./Pages/Home";
import LandingPage from "./Pages/LandingPage";
import User from "./Pages/User"
import NavBar from "./Components/NavBar"

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Widget, addResponseMessage} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css'
import ChatBot from 'react-simple-chatbot';
import SimpleChatBox from './Components/SimpleChatBox.jsx';

const handleNewUserMessage = (newMessage) =>{

  addResponseMessage("<p> hola </p>");
};
const steps = [
  {
    id: '0',
    message: 'Welcome to react chatbot!',
    trigger: '1',
  },
  {
    id: '1',
    message: 'Bye!',
    end: true,
  },
];
export default function App() {

  return (
    <Router>

      <NavBar/>

      <Switch>
        <Route exact path="/">
          <LandingPage/>
        </Route>
        <Route path="/home">
          <Home/>
        </Route>
        <Route path="/user">
          <User/>
        </Route>
      </Switch>
      <SimpleChatBox></SimpleChatBox>


    </Router>

  );
}
ReactDOM.render(
  <div>
    <ChatBot steps={steps} />
  </div>,
  document.getElementById('root')
);