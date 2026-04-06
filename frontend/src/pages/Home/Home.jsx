import React, { useState } from "react";
import "./Home.css";
import ItemsList from "../../components/ItemsList/ItemsList";
import SectionsList from "../../components/SectionsList/SectionsList";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  const [filtro, setFiltro] = useState("");



  return (
    <div className="home-container">
      <div className="home-container-top">
        <div id="home-container-top-text">
          <h1 id="top-h1-text">DESCUBRE A LOS MEJORES ARTISTAS EN <span id="texto-h1-echo">ECHO</span></h1>
        </div>
        <div id="home-container-top-buttons">
          <div className="button-top">Contratar a un autonomo</div>
          <div className="button-top">Subir un servicio</div>
        </div>
      </div>
      <div className="home-container-search-section">
        <input
          type="text"
          placeholder="Buscar en Echo..."
          className="search-bar"
        />
      </div>
      <div className="home-container-sections">
        <SectionsList />
      </div>
      <div className="home-container-item-section">
        <ItemsList />

      </div>
      
      <Footer />
    </div>
  );
}