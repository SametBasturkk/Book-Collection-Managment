
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import React, { Component } from 'react';

import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from './Pages/Landing/Landing.js';
import Profile from './Components/profile.js';
import Collections from './Pages/Collections/Collections.js';
import Item from './Pages/Item/item.js';
import CollectionDetails from './Pages/collectionDetails/collectionDetails.js';
import Admin from './Pages/adminDashboard/admin.js';

import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev--8cbx12e.us.auth0.com"
    clientId="m8GiH4PwQjrQ7rpbbU5OHsfmuXBtnMre"
    redirectUri={window.location.origin}
    useRefreshTokens={true}
    cacheLocation="localstorage"

  >
    <BrowserRouter>
      <App />
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/collections" element={<Collections />}></Route>
        <Route path="/item:id" element={<Item />}></Route>
        <Route path="/collection:id" element={<CollectionDetails />}></Route>

      </Routes>
    </BrowserRouter>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
