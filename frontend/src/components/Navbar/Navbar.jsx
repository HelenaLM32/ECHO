import React from "react";
import "./Navbar.css";
import placeholder from '../../assets/ECHO_placeholder.png';

export default function Navbar() {
  
  return (
    
    <div className="nav-bar">
      <div className="left-nav">
        <img src={placeholder} className="logo-echo" alt="echo" />
        <a href="/" className="a-left">Explorar</a>
        <a href="/" className="a-left">Trabajos</a>
        <a href="/" className="a-left">Recursos</a>
      </div>
      <div className="right-nav">
        <div className="button-container" id="btn-1">
          <a href="/register" className="a-right" id="a-1">Registrarse</a>
        </div>
        <div className="button-container" id="btn-2">
          <a href="/login" className="a-right" id="a-2">Iniciar sesión</a>
        </div>
      </div>
    </div>
  );
}
