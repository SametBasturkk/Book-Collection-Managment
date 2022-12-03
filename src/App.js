import './App.css';
import React, { useState, useSelect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";




import LoginButton from './Components/login.js';
import LogoutButton from './Components/logout.js';
import Search from './Components/search.js';
import { Navbar, Nav, NavDropdown, Form, Container, Button, FormControl } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHouse, faUser } from '@fortawesome/free-solid-svg-icons'



import 'bootstrap/dist/css/bootstrap.min.css';


const Auth = () => {

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isAuthenticated == false) {
    localStorage.removeItem("userId");
    return (
      <LoginButton />


    );
  } else {

    localStorage.setItem("userId", user.sub.split("|")[1]);



    fetch("http://localhost:3001/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        userId: user.sub.split("|")[1],
        userName: user.name,

      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.userRole == "admin") {
          console.log("admin");
          localStorage.setItem("userRole", "admin");
        }
        else {
          console.log("user");
          localStorage.setItem("userRole", "user");
        }
      }
      );

    return (

      <LogoutButton />

    );
  }
}








function App() {
  const [options, setOptions] = useState([]);



  const onSelect = (value) => {
    console.log('onSelect', value);
  };


  return (
    <div>


      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">ITRANSITION</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="/">   <FontAwesomeIcon icon={faHouse} /> Home</Nav.Link>
              <Nav.Link href="/profile"><FontAwesomeIcon icon={faUser} /> Profile</Nav.Link>
              <Nav.Link href="/collections"><FontAwesomeIcon icon={faBook} /> Collections</Nav.Link>
              {
                localStorage.getItem("userRole") === "admin" ?
                  <Nav.Link href="/admin"><FontAwesomeIcon icon={faUser} /> Admin</Nav.Link>
                  : <p></p>

              }

            </Nav>
            <Form className="d-flex">
              <Search />
            </Form>
            <Auth />
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </div >
  );
}

export default App;
