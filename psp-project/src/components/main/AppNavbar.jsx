import React from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";


const AppNavbar = () => {
  return (
    // <Navbar bg="primary" variant="dark" expand="lg">
    //   <Container>
    //     <Navbar.Brand href="/">DAUYS APP</Navbar.Brand>
    //     <Nav className="ms-auto">
    //       <Nav.Link href="/login">Face ID</Nav.Link>
    //       <Nav.Link href="/dashboard">Профиль</Nav.Link>
    //       <Nav.Link href="/polls1">Опросы</Nav.Link>
    //     </Nav>
    //   </Container>
    // </Navbar>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">FaceAuth</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
        <li className="nav-item">
            <Link className="nav-link" to="/login">Вход</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Панель</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/polls1">Опросы</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/all_polls">Опросы</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AppNavbar;
