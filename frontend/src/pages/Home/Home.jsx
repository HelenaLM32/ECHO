import React, { useState, useEffect } from "react";
import "./Home.css";
import ItemsList from "../../components/ItemsList/ItemsList";
import SectionsList from "../../components/SectionsList/SectionsList";
import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSections } from "../../services/sections";

export default function Home() {
  const [filtro, setFiltro] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  // When route contains a category slug, load categories and set the selected one
  useEffect(() => {
    const slug = params.slug;
    if (!slug) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSections();
        const found = data.find((c) => c.slug === slug || String(c.id) === slug || c.id === slug);
        if (mounted) setSelectedCategory(found || null);
      } catch (e) {
        console.error("Error fetching categories for slug", slug, e);
      }
    })();
    return () => (mounted = false);
  }, [params.slug]);

  // Handler passed to SectionsList: set selected and navigate
  const handleSelect = (section) => {
    setSelectedCategory(section);
    if (section && section.slug) {
      navigate(`/category/${section.slug}`);
    }
  };



  return (
    <div className="home-container">

      {/* Si no hay categoria seleccionada */}
      {!selectedCategory && (
        <div className="home-container-top">
          <div id="home-container-top-text">
            <h1 id="top-h1-text">DESCUBRE A LOS MEJORES ARTISTAS EN <span id="texto-h1-echo">ECHO</span></h1>
          </div>
          <div id="home-container-top-buttons">
            <div className="button-top">Contratar a un autonomo</div>
            <div className="button-top">Subir un servicio</div>
          </div>
        </div>
      )}

      <div className="home-container-search-section">
        <input
          type="text"
          placeholder="Buscar en Echo..."
          className="search-bar"
        />
      </div>
      <div className="home-container-sections">
        <SectionsList onSelect={handleSelect} />
      </div>
      {selectedCategory && (
        <div className="home-category-title-container">
          <h1 id="top-h1-text-category">{selectedCategory.name}</h1>
          <div className="button-selected-category">Seguir {selectedCategory.name}</div>
        </div>
      )}
      <div className="home-container-item-section">
        <ItemsList />

      </div>

      <Footer />
    </div>
  );
}