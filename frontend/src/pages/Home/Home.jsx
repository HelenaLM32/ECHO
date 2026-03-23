import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-container-top">
        <div id="home-container-top-text">
          <h1 id="top-h1-text">Descubre a los mejores artistas en ECHO</h1>
          <p id="top-p-text">
            Una plataforma integral para ayudar a contratantes y creadores a
            navegar por el mundo creativo, desde la inspiración hasta la
            comunicación
          </p>
        </div>
        <div id="home-container-top-buttons">
          <div className="button-top">Contratar a un autonomo</div>
          <div className="button-top">Mejores valorados</div>
        </div>
      </div>
      <div className="home-container-search-section">
        <input
          type="text"
          placeholder="Buscar artistas..."
          className="search-bar"
        />
        <select  className="filter-button" onChange={(e) => setFiltro(e.target.value)} defaultValue="">
          <option value="" disabled>
            Filtrar
          </option>
          <option value="activo">filtro 1</option>
          <option value="inactivo">filtro 2</option>
          <option value="pendiente">filtro 3</option>
        </select>
      </div>
      <div className="home-container-item-section">item section</div>
    </div>
  );
}
