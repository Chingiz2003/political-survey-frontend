import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">FaceAuth</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Панель</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/polls">Опросы</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
