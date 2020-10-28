//React Components
import React from "react";
import ReactDOM from "react-dom";
import NavBar from "./Components/NavBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import ChatBot from 'react-simple-chatbot';
import SimpleChatBox from './Components/SimpleChatBox';

import Products from "./Pages/Products"
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";

const handleNewUserMessage = (newMessage) => {
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
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/products">
          <Products />
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
