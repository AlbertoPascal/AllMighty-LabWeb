import React from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CheckLogin from "./Components/CheckLogin"


//With the "CheckLogin" component, the app checks ig the user has authenticated yet and, if not, it asks them to login with auth0
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
     domain="a01021323.auth0.com"
     clientId="dDYeTl9U1ZmOf5gkRaY6zDFj2iIN9Okj"
     redirectUri={window.location.origin}
    >
      <CheckLogin/>

    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
